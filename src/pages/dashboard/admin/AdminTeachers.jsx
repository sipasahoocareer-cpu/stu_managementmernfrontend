import { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiSave, FiUser } from 'react-icons/fi';
import { getTeachers, createTeacher, editTeacher, deleteTeacher } from '../../../api';
import './AdminTeachers.css';

const emptyForm = {
  name: '',
  teacher_id: '',
  subject: '',
  password: '',
};

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'Hindi',
    'Computer Science',
    'Physical Education',
  ];

  const fetchTeachers = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const res = await getTeachers(q);
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const timer = setTimeout(() => fetchTeachers(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchTeachers]);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditMode(false);
    setEditingId(null);
    setCreatedCredentials(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setFormData({
      name: teacher.name || '',
      teacher_id: teacher.teacher_id || '',
      subject: teacher.subject || '',
      password: '',
    });
    setEditMode(true);
    setEditingId(teacher.id);
    setCreatedCredentials(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: formData.name.trim(),
        teacher_id: formData.teacher_id.trim(),
        subject: formData.subject.trim(),
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      if (editMode) {
        await editTeacher(editingId, payload);
        setCreatedCredentials(null);
      } else {
        const res = await createTeacher(payload);
        setCreatedCredentials({
          teacher_id: res.data?.data?.teacher_id || payload.teacher_id,
          password: res.data?.login_password || payload.password || payload.teacher_id,
        });
      }

      setShowModal(false);
      fetchTeachers(searchQuery);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
      setDeleteConfirm(null);
      fetchTeachers(searchQuery);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">
            Create teacher logins with an assigned teacher ID and password.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Teacher
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '24px',
        }}
      >
        <FiSearch />
        <input
          type="text"
          placeholder="Search by name, teacher ID, or subject"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '1rem',
            background: 'transparent',
          }}
        />
        {searchQuery && (
          <button
            className="btn-icon"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {createdCredentials && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ecfeff, #eff6ff)',
            border: '1px solid #bfdbfe',
            color: '#1e3a8a',
          }}
        >
          <strong>Teacher login created.</strong> ID: {createdCredentials.teacher_id} | Password:{' '}
          {createdCredentials.password}
        </div>
      )}

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <h3 style={{ marginTop: 0 }}>No teachers found</h3>
          <p style={{ color: '#6b7280' }}>
            Add a teacher to create their login credentials.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Teacher ID</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="font-medium">{teacher.name}</td>
                  <td>{teacher.teacher_id}</td>
                  <td>
                    <span className="badge badge-warning">{teacher.subject || 'Unassigned'}</span>
                  </td>
                  <td>
                    <button className="btn-icon" title="Edit" onClick={() => openEditModal(teacher)}>
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      title="Delete"
                      onClick={() => setDeleteConfirm(teacher.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'grid',
                  placeItems: 'center',
                  background: '#f3e8ff',
                  color: '#7c3aed',
                }}
              >
                <FiUser />
              </div>
              <div>
                <h2 style={{ marginBottom: 4 }}>{editMode ? 'Edit Teacher' : 'Add Teacher'}</h2>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {editMode
                    ? 'Update teacher details and login credentials.'
                    : 'Create the name, teacher ID, and password they will use to log in.'}
                </p>
              </div>
            </div>

            {error && (
              <div style={{ color: '#b91c1c', background: '#fef2f2', padding: '10px 12px', borderRadius: '10px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <input
                type="text"
                placeholder="Teacher ID"
                required
                value={formData.teacher_id}
                onChange={(e) =>
                  setFormData({ ...formData, teacher_id: e.target.value.toUpperCase() })
                }
                style={{ width: '100%', marginBottom: 12 }}
              />
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%', marginBottom: 12 }}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder={editMode ? 'Leave blank to keep current password' : 'Password (optional)'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : editMode ? 'Update Teacher' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Teacher?</h2>
            <p style={{ color: '#6b7280' }}>
              This removes the teacher account and their login access.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleDelete(deleteConfirm)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
