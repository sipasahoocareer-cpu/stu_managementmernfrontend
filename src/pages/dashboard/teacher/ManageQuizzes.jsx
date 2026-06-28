import { useEffect, useState } from 'react';
import { listQuizzes, viewQuizResults, deleteQuiz } from '../../../api';

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [resultsError, setResultsError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadQuizzes = async () => {
    setError('');
    try {
      const r = await listQuizzes();
      const fetched = r.data?.data || [];
      setQuizzes(fetched);
      if (fetched.length > 0) {
        handleSelectQuiz(fetched[0]);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not load quizzes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadQuizzes();
  };

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setResults([]);
    setResultsError('');
    setLoadingResults(true);
    try {
      const r = await viewQuizResults(quiz.id);
      const subs = r.data?.results || [];
      setResults(subs);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Could not load submissions.';
      setResultsError(msg);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz and all submissions?')) return;
    setDeleting(true);
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      if (selectedQuiz?.id === quizId) {
        setSelectedQuiz(null);
        setResults([]);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not delete quiz.');
    } finally {
      setDeleting(false);
    }
  };

  const formatClass = (cn) => {
    if (!cn) return '';
    if (cn === 'PGDCA') return 'PGDCA';
    return `Class ${cn}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Teacher Quiz Review</h1>
          <p className="page-subtitle">See student quiz submissions and delete quizzes if needed.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1
          }}
        >
          {refreshing ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* ── Left: Quiz List ── */}
        <div className="card">
          <h2 className="card-title">Your Quizzes</h2>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : quizzes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No quizzes created yet</div>
              <div className="empty-state-desc">Create a quiz first, then students can attempt it.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="card"
                  style={{
                    padding: '16px',
                    border: selectedQuiz?.id === quiz.id ? '2px solid #6366f1' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{quiz.title}</div>
                      {quiz.description && (
                        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                          {quiz.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        <span className="badge badge-primary">Marks: {quiz.total_marks}</span>
                        {quiz.class_name && (
                          <span className="badge badge-secondary">{formatClass(quiz.class_name)}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleSelectQuiz(quiz)}
                      >
                        👁 Review
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        disabled={deleting}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Submissions Panel ── */}
        <div className="card">
          <h2 className="card-title">
            Submissions
            {selectedQuiz && (
              <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                — {selectedQuiz.title}
              </span>
            )}
          </h2>

          {!selectedQuiz ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Select a quiz to review</div>
              <div className="empty-state-desc">Click 👁 Review on any quiz to see student submissions.</div>
            </div>
          ) : loadingResults ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : resultsError ? (
            <div className="alert alert-error">{resultsError}</div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No submissions yet</div>
              <div className="empty-state-desc">No students have submitted this quiz yet.</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <span className="badge badge-primary">{results.length} submission{results.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map((sub, index) => {
                  const studentLabel = sub.student_name || sub.student_id || 'Unknown student';
                  const submittedAt = sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : 'Unknown';

                  return (
                    <div
                      key={sub.id || index}
                      className="card"
                      style={{ padding: '14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>
                            #{index + 1} {studentLabel}
                          </span>
                          {sub.student_name && sub.student_id && sub.student_id !== sub.student_name && (
                            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 6 }}>
                              ({sub.student_id})
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span className="badge badge-secondary">
                            {sub.marks !== null && sub.marks !== undefined ? `Marks: ${sub.marks}` : 'Not graded'}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                        Submitted: {submittedAt}
                      </div>
                    <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: '10px 12px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-primary)', marginBottom: 6 }}>
                        Answers
                      </div>
                      {typeof sub.answers === 'object' && sub.answers !== null ? (
                        Object.entries(sub.answers).map(([key, val]) => (
                          <div key={key} style={{ fontSize: 13, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600 }}>Q{Number(key) + 1}:</span> {val}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 13 }}>{sub.answers}</div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
