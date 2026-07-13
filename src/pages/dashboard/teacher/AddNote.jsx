import { useState } from 'react';
import { createNote } from '../../../api';

export default function AddNote() {
  const [form, setForm] = useState({ title: '', content: '', file: null, class_name: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('content', form.content);
      data.append('class_name', form.class_name);
      data.append('file', form.file);

      await createNote(data);
      setSuccess('Successfully uploaded. Students can now view the PDF note.');
      setForm({ title: '', content: '', file: null, class_name: '' });
      e.target.reset();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to upload note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ title: '', content: '', file: null, class_name: '' });
    setSuccess('');
    setError('');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Add PDF Note</h1>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div className="card">
          {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>{success}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Note Title</label>
              <input
                className="form-control"
                placeholder="e.g., Chapter 3 - Photosynthesis"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-control"
                required
                value={form.class_name}
                onChange={(e) => setForm({ ...form, class_name: e.target.value })}
              >
                <option value="">Select class</option>
                {[...Array(10)].map((_, idx) => (
                  <option key={idx} value={`${idx + 1}`}>Class {idx + 1}</option>
                ))}
                <option value="PGDCA">PGDCA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-control"
                placeholder="Optional description for this PDF..."
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PDF File</label>
              <input
                className="form-control"
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload PDF Note'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearForm}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
