import { useEffect, useState, useCallback } from 'react';
import { FiTrash2, FiCheckCircle, FiClock, FiMail, FiRefreshCw } from 'react-icons/fi';
import { getAdminQueries, resolveQuery, deleteQuery } from '../../../api';
import './AdminQueries.css';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'resolved'
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminQueries();
      setQueries(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch queries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const handleResolve = async (id) => {
    try {
      const res = await resolveQuery(id);
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? res.data.data : q))
      );
    } catch (err) {
      console.error('Failed to resolve:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuery(id);
      setQueries((prev) => prev.filter((q) => q.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filtered = queries.filter((q) => {
    if (filter === 'pending') return q.status === 'pending';
    if (filter === 'resolved') return q.status === 'resolved';
    return true;
  });

  const pendingCount = queries.filter((q) => q.status === 'pending').length;
  const resolvedCount = queries.filter((q) => q.status === 'resolved').length;

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="admin-queries-page">
      {/* Header */}
      <div className="queries-header">
        <div>
          <h1 className="queries-title">💬 Contact Queries</h1>
          <p className="queries-subtitle">Manage all user-submitted contact requests</p>
        </div>
        <button className="queries-refresh-btn" onClick={fetchQueries} title="Refresh">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="queries-stats">
        <div className="queries-stat-card queries-stat-total">
          <div className="queries-stat-icon">📬</div>
          <div>
            <div className="queries-stat-num">{queries.length}</div>
            <div className="queries-stat-label">Total Queries</div>
          </div>
        </div>
        <div className="queries-stat-card queries-stat-pending">
          <div className="queries-stat-icon">⏳</div>
          <div>
            <div className="queries-stat-num">{pendingCount}</div>
            <div className="queries-stat-label">Pending</div>
          </div>
        </div>
        <div className="queries-stat-card queries-stat-resolved">
          <div className="queries-stat-icon">✅</div>
          <div>
            <div className="queries-stat-num">{resolvedCount}</div>
            <div className="queries-stat-label">Resolved</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="queries-filters">
        {['all', 'pending', 'resolved'].map((f) => (
          <button
            key={f}
            className={`queries-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '🗂 All' : f === 'pending' ? '⏳ Pending' : '✅ Resolved'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="queries-loading">
          <div className="queries-spinner" />
          <p>Loading queries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="queries-empty">
          <div className="queries-empty-icon">📭</div>
          <h3>No {filter !== 'all' ? filter : ''} queries found</h3>
          <p>When users submit contact forms, they'll appear here.</p>
        </div>
      ) : (
        <div className="queries-list">
          {filtered.map((query) => (
            <div
              key={query.id}
              className={`query-card ${query.status === 'resolved' ? 'query-card-resolved' : 'query-card-pending'}`}
            >
              <div className="query-card-header">
                <div className="query-sender-info">
                  <div className="query-avatar">
                    {query.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="query-sender-name">{query.name}</div>
                    {query.email && (
                      <div className="query-sender-email">
                        <FiMail size={12} /> {query.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="query-meta">
                  <span className={`query-status-badge ${query.status === 'resolved' ? 'resolved' : 'pending'}`}>
                    {query.status === 'resolved' ? <FiCheckCircle /> : <FiClock />}
                    {query.status}
                  </span>
                  <span className="query-date">{formatDate(query.submitted_at)}</span>
                </div>
              </div>

              <div className="query-subject">{query.subject}</div>

              <div
                className={`query-message ${expandedId === query.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === query.id ? null : query.id)}
              >
                {query.message}
                {query.message?.length > 120 && (
                  <span className="query-expand-hint">
                    {expandedId === query.id ? ' (click to collapse)' : ' ... (click to expand)'}
                  </span>
                )}
              </div>

              <div className="query-actions">
                <button
                  className={`query-resolve-btn ${query.status === 'resolved' ? 'unresolve' : ''}`}
                  onClick={() => handleResolve(query.id)}
                  title={query.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                >
                  <FiCheckCircle />
                  {query.status === 'resolved' ? 'Mark Pending' : 'Mark Resolved'}
                </button>
                <button
                  className="query-delete-btn"
                  onClick={() => setDeleteConfirm(query.id)}
                  title="Delete query"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="queries-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="queries-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="queries-confirm-icon">🗑️</div>
            <h3>Delete Query?</h3>
            <p>This query will be permanently removed from the database.</p>
            <div className="queries-confirm-actions">
              <button
                className="queries-cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="queries-delete-confirm-btn"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
