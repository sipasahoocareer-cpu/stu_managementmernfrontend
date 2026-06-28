import { useEffect, useState } from 'react';
import { createResult, getAllStudents } from '../../../api';

export default function AddMarks() {
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [marks, setMarks] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllStudents()
      .then((r) => setStudents(r.data?.data || r.data || []))
      .catch(() => setStudents([]))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter result title.');
      return;
    }

    const entries = Object.entries(marks).filter(([, value]) => value !== '');
    if (entries.length === 0) {
      setError('Please enter marks for at least one student.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await Promise.all(
        entries.map(([studentId, value]) =>
          createResult({
            student_id: studentId,
            title,
            marks: Number(value),
            total_marks: Number(totalMarks),
            remarks: remarks[studentId] || '',
          })
        )
      );
      setSuccess('Marks saved successfully. Students can now view their result.');
      setMarks({});
      setRemarks({});
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save marks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Add Result Marks</h1>
        <p className="page-subtitle">Select students and publish marks to their dashboard.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 180px', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Result Title</label>
              <input
                className="form-control"
                placeholder="e.g., Unit Test 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input
                className="form-control"
                type="number"
                min="1"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>{success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

        {fetching ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No Students Found</div>
            <div className="empty-state-desc">No students are registered yet.</div>
          </div>
        ) : (
          <>
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Marks</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            max={totalMarks}
                            placeholder="0"
                            style={{ maxWidth: 120 }}
                            value={marks[student.id] || ''}
                            onChange={(e) => setMarks((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Optional"
                            value={remarks[student.id] || ''}
                            onChange={(e) => setRemarks((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Marks'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
