import { useEffect, useState } from 'react';
import { createAttendance, getAllStudents } from '../../../api';

export default function AddAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    getAllStudents()
      .then((r) => {
        const list = r.data?.data || r.data || [];
        setStudents(list);
        const initial = {};
        list.forEach((student) => {
          initial[student.id] = 'present';
        });
        setAttendance(initial);
      })
      .catch(() => setStudents([]))
      .finally(() => setFetching(false));
  }, []);

  const toggleAll = (status) => {
    const next = {};
    students.forEach((student) => {
      next[student.id] = status;
    });
    setAttendance(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await Promise.all(
        students.map((student) =>
          createAttendance({ student_id: student.id, status: attendance[student.id], date })
        )
      );
      setSuccess(`Attendance marked for ${students.length} students on ${date}.`);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter((value) => value === 'present').length;
  const absentCount = Object.values(attendance).filter((value) => value === 'absent').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Add Attendance</h1>
        <p className="page-subtitle">Mark attendance beside each student name.</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '0 0 220px' }}>
            <label className="form-label">Select Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button type="button" className="btn btn-success btn-sm" onClick={() => toggleAll('present')}>Mark All Present</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => toggleAll('absent')}>Mark All Absent</button>
          </div>
          <div style={{ marginLeft: 'auto', marginTop: 20, display: 'flex', gap: 12 }}>
            <span className="badge badge-success">Present: {presentCount}</span>
            <span className="badge badge-danger">Absent: {absentCount}</span>
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
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          {student.name}
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>{student.email}</td>
                      <td>{student.registration_number || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['present', 'absent'].map((option) => (
                            <label
                              key={option}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                background: attendance[student.id] === option
                                  ? (option === 'present' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)')
                                  : 'var(--color-surface)',
                                border: `1px solid ${attendance[student.id] === option
                                  ? (option === 'present' ? 'rgba(16,185,129,0.5)' : 'rgba(244,63,94,0.5)')
                                  : 'var(--color-border)'}`,
                                fontSize: 13,
                                fontWeight: 500,
                                color: attendance[student.id] === option
                                  ? (option === 'present' ? '#34d399' : '#fb7185')
                                  : 'var(--color-text-secondary)',
                              }}
                            >
                              <input
                                type="radio"
                                name={`att_${student.id}`}
                                value={option}
                                checked={attendance[student.id] === option}
                                onChange={() => setAttendance((prev) => ({ ...prev, [student.id]: option }))}
                                style={{ display: 'none' }}
                              />
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : `Save Attendance for ${students.length} Students`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
