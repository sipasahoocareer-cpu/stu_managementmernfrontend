import { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiSave, FiUser } from 'react-icons/fi';
import { apiBaseURLDisplay, getAllStudents, addStudent, editStudent, deleteStudent } from '../../../api';
import './AdminStudents.css';

const emptyForm = {
  name: '',
  password: '',
  class_name: '',
};

const classOptions = [
  ...Array.from({ length: 10 }, (_, i) => String(i + 1)),
  'PGDCA',
];

const getStudentClass = (student) => student.class_name || student.department || '';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchStudents = useCallback(async (q = '') => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await getAllStudents(q);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      if (!err?.response) {
        setFetchError(`Cannot reach the backend on ${apiBaseURLDisplay}. Make sure the API server is running.`);
      } else {
        setFetchError(err.response.data?.detail || 'Failed to fetch students. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const timer = setTimeout(() => fetchStudents(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchStudents]);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditMode(false);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setFormData({
      name: student.name || '',
      password: '',
      class_name: getStudentClass(student),
    });
    setEditMode(true);
    setEditingId(student.id);
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
        class_name: formData.class_name.trim(),
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      if (editMode) {
        await editStudent(editingId, payload);
      } else {
        await addStudent(payload);
      }

      setShowModal(false);
      fetchStudents(searchQuery);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string'
        ? detail
        : detail?.detail || err?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setDeleteConfirm(null);
      fetchStudents(searchQuery);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="admin-students-page">
      <div className="students-page-header">
        <div>
          <h1 className="students-page-title">Student Management</h1>
          <p className="students-page-subtitle">
            {students.length} student{students.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button className="students-add-btn" onClick={openAddModal} id="add-student-btn">
          <FiPlus /> Add Student
        </button>
      </div>

      <div className="students-search-bar">
        <FiSearch className="students-search-icon" />
        <input
          type="text"
          placeholder="Search by student name or class..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="students-search-input"
          id="student-search"
        />
        {searchQuery && (
          <button className="students-search-clear" onClick={() => setSearchQuery('')}>
            <FiX />
          </button>
        )}
      </div>

      {fetchError && <div className="students-fetch-error">{fetchError}</div>}

      {loading ? (
        <div className="students-loading">
          <div className="students-spinner" />
          <p>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="students-empty">
          <div className="students-empty-icon">ST</div>
          <h3>{searchQuery ? 'No students found for your search' : 'No students added yet'}</h3>
          <p>{searchQuery ? 'Try a different search term' : 'Click "Add Student" to get started'}</p>
        </div>
      ) : (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id} className="students-table-row">
                  <td className="students-idx">{idx + 1}</td>
                  <td className="students-name">
                    <div className="student-name-cell">
                      <div className="student-avatar">
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="students-class-badge">{getStudentClass(student) || 'Not set'}</span>
                  </td>
                  <td>
                    <div className="students-actions">
                      <button className="students-edit-btn" title="Edit" onClick={() => openEditModal(student)}>
                        <FiEdit2 />
                      </button>
                      <button className="students-delete-btn" title="Delete" onClick={() => setDeleteConfirm(student.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="students-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="students-modal" onClick={(e) => e.stopPropagation()}>
            <div className="students-modal-header">
              <div className="students-modal-icon">
                <FiUser />
              </div>
              <div>
                <h2>{editMode ? 'Edit Student' : 'Add New Student'}</h2>
                <p>{editMode ? 'Update student details' : 'Enter student name, password, and class'}</p>
              </div>
              <button className="students-modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            {error && <div className="students-modal-error">{error}</div>}

            <form onSubmit={handleSubmit} className="students-modal-form">
              <div className="students-form-grid students-form-grid-simple">
                <div className="students-form-group">
                  <label>Student Name *</label>
                  <input
                    type="text"
                    placeholder="Enter student name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    id="student-name-input"
                  />
                </div>

                <div className="students-form-group">
                  <label>Password {editMode ? '' : '*'}</label>
                  <input
                    type="password"
                    placeholder={editMode ? 'Leave blank to keep current password' : 'Enter password'}
                    required={!editMode}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    id="student-password-input"
                  />
                </div>

                <div className="students-form-group students-form-group-full">
                  <label>Class *</label>
                  <select
                    required
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    id="student-class-select"
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'PGDCA' ? 'PGDCA' : `Class ${option}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="students-modal-actions">
                <button type="button" className="students-cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="students-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : <><FiSave /> {editMode ? 'Update Student' : 'Add Student'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="students-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="students-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="students-confirm-icon">!</div>
            <h3>Delete Student?</h3>
            <p>This action cannot be undone. The student will be permanently removed.</p>
            <div className="students-confirm-actions">
              <button className="students-cancel-btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="students-delete-confirm-btn" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
