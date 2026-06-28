import { useEffect, useState } from 'react';
import { listAttendance } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendance = async () => {
    if (!user?.id) return;
    try {
      const r = await listAttendance(user.id);
      setRecords(r.data?.data || r.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const present = records.filter(r => r.status?.toLowerCase() === 'present').length;
  const absent  = records.filter(r => r.status?.toLowerCase() === 'absent').length;
  const total   = records.length;
  const pct     = total ? Math.round((present / total) * 100) : 0;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'present') return <span className="badge badge-success">Present</span>;
    if (s === 'absent')  return <span className="badge badge-danger">Absent</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">📅 Attendance Record</h1>
        <p className="page-subtitle">Attendance for {user?.name || 'your account'}.</p>
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

      {/* Summary Cards */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>📋</div>
          <div><div className="stat-value">{total}</div><div className="stat-label">Total Days</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✅</div>
          <div><div className="stat-value">{present}</div><div className="stat-label">Days Present</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>❌</div>
          <div><div className="stat-value">{absent}</div><div className="stat-label">Days Absent</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6' }}>📊</div>
          <div>
            <div className="stat-value" style={{ color: pct >= 75 ? '#10b981' : '#f43f5e' }}>
              {pct}%
            </div>
            <div className="stat-label">Attendance %</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>Overall Attendance</span>
          <span style={{ color: pct >= 75 ? '#10b981' : '#f43f5e', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-full)', height: 12, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: pct >= 75 ? 'var(--gradient-teal)' : 'linear-gradient(135deg,#f43f5e,#f59e0b)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 1s ease',
          }} />
        </div>
        {pct < 75 && (
          <div className="alert alert-error" style={{ marginTop: 12 }}>
            ⚠️ Your attendance is below 75%. Please attend classes regularly.
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No Records Found</div>
          <div className="empty-state-desc">Attendance hasn't been marked yet.</div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Attendance Log</h3></div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().map((rec, i) => (
                  <tr key={rec.id || i}>
                    <td>{i + 1}</td>
                    <td>{rec.date ? new Date(rec.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</td>
                    <td>{getStatusBadge(rec.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
