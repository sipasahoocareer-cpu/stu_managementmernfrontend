import { useEffect, useState } from 'react';
import { listQuizzes, submitQuiz } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export default function AttendQuiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive]     = useState(null);
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const r = await listQuizzes();
      setQuizzes(r.data?.data || r.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchQuizzes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchQuizzes();
  };

  const handleSubmit = async (quiz) => {
    setSubmitting(true);
    try {
      await submitQuiz(quiz.id, { answers });
      setSubmitted(prev => ({ ...prev, [quiz.id]: true }));
      setActive(null);
      setAnswers({});
    } catch (e) {
      alert(e?.response?.data?.detail || 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">🧠 Attend Quiz</h1>
        <p className="page-subtitle">
          Showing quizzes for your class
          {user?.class_name ? <strong> — Class {user.class_name}</strong> : ''}. Good luck!
        </p>
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

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No Quizzes Available</div>
          <div className="empty-state-desc">
            No quizzes have been created for{user?.class_name ? ` Class ${user.class_name}` : ' your class'} yet.
          </div>
        </div>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card quiz-item">
              <div className="quiz-item-header">
                <div>
                  <div className="quiz-item-title">{quiz.title}</div>
                  {quiz.description && <div className="quiz-item-desc">{quiz.description}</div>}
                  <div className="quiz-item-meta" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">Total: {quiz.total_marks} marks</span>
                    {quiz.class_name && (
                      <span className="badge badge-secondary">{quiz.class_name}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {submitted[quiz.id] ? (
                    <span className="badge badge-success">✅ Submitted</span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => { setActive(active === quiz.id ? null : quiz.id); setAnswers({}); }}
                    >
                      {active === quiz.id ? 'Close' : 'Start Quiz'}
                    </button>
                  )}
                </div>
              </div>

              {active === quiz.id && !submitted[quiz.id] && (
                <div className="quiz-attempt">
                  <div className="quiz-attempt-banner">
                    <span>📝 Answer all questions below</span>
                    <span className="badge badge-warning">{quiz.total_marks} marks</span>
                  </div>

                  {/* Questions if available */}
                  {(quiz.questions || []).length > 0 ? (
                    quiz.questions.map((q, qi) => (
                      <div key={qi} className="quiz-question-block">
                        <div className="quiz-q-num">Q{qi + 1}</div>
                        <div className="quiz-q-text">{q.question}</div>
                        {q.options && JSON.parse(q.options || '[]').map((opt, oi) => (
                          <label key={oi} className="quiz-option">
                            <input
                              type="radio"
                              name={`q_${qi}`}
                              value={opt}
                              checked={answers[qi] === opt}
                              onChange={() => setAnswers(prev => ({ ...prev, [qi]: opt }))}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                        {!q.options && (
                          <input
                            className="form-control"
                            placeholder="Your answer..."
                            style={{ marginTop: 8 }}
                            value={answers[qi] || ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [qi]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="quiz-text-answer">
                      <div className="form-group">
                        <label className="form-label">Your Answer / Response</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Write your answers here..."
                          value={answers[0] || ''}
                          onChange={e => setAnswers({ 0: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 'var(--space-lg)' }}
                    onClick={() => handleSubmit(quiz)}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz →'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .quiz-list { display: flex; flex-direction: column; gap: var(--space-lg); }
        .quiz-item-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
        .quiz-item-title  { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .quiz-item-desc   { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px; }
        .quiz-item-meta   { display: flex; gap: 8px; }
        .quiz-attempt     { border-top: 1px solid var(--color-border); margin-top: 20px; padding-top: 20px; display: flex; flex-direction: column; gap: 16px; }
        .quiz-attempt-banner { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: rgba(99,102,241,0.1); border-radius: var(--radius-md); font-size: 14px; font-weight: 500; }
        .quiz-question-block { background: var(--color-surface); border-radius: var(--radius-md); padding: var(--space-lg); }
        .quiz-q-num  { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-accent-primary); margin-bottom: 6px; }
        .quiz-q-text { font-size: 15px; font-weight: 500; margin-bottom: 12px; }
        .quiz-option { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s; }
        .quiz-option:hover { background: var(--color-bg-card-hover); }
        .quiz-option input { accent-color: var(--color-accent-primary); width: 16px; height: 16px; }
      `}</style>
    </div>
  );
}
