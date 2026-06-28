import { useEffect, useState } from 'react';
import { listResults } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export default function ViewResult() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    listResults(user.id)
      .then((r) => setResults(r.data?.data || r.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [user]);

  const getScoreColor = (marks, total) => {
    const pct = total ? (marks / total) * 100 : 0;
    if (pct >= 80) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Results</h1>
        <p className="page-subtitle">Results published for {user?.name || 'you'}.</p>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No Results Found</div>
          <div className="empty-state-desc">Your teacher has not added marks yet.</div>
        </div>
      ) : (
        <div className="grid grid-auto">
          {results.map((result) => (
            <div key={result.id} className="card result-card">
              <div className="result-card-header">
                <div>
                  <div className="result-quiz-title">{result.title}</div>
                  <div className="result-quiz-total">
                    Published by {result.teacher_name || 'Teacher'}
                  </div>
                </div>
              </div>
              <div className="result-details">
                <div className="result-score-row">
                  <span className="result-score-label">Your Score</span>
                  <span
                    className="result-score-value"
                    style={{ color: getScoreColor(result.marks, result.total_marks) }}
                  >
                    {result.marks} / {result.total_marks}
                  </span>
                </div>
                {result.remarks && <div className="result-date">Remark: {result.remarks}</div>}
                <div className="result-date">
                  Date: {result.created_at ? new Date(result.created_at).toLocaleDateString('en-IN') : '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .result-card { transition: all 0.25s ease; }
        .result-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .result-quiz-title { font-size: 16px; font-weight: 600; }
        .result-quiz-total { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
        .result-details { border-top: 1px solid var(--color-border); padding-top: 12px; margin-top: 8px; }
        .result-score-row { display: flex; justify-content: space-between; align-items: center; }
        .result-score-label { font-size: 13px; color: var(--color-text-secondary); }
        .result-score-value { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; }
        .result-date { font-size: 12px; color: var(--color-text-muted); margin-top: 8px; }
      `}</style>
    </div>
  );
}
