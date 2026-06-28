import { useState } from 'react';
import { createQuiz } from '../../../api';

export default function AddQuiz() {
  const [form, setForm]       = useState({ title: '', description: '', total_marks: 100, class_name: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await createQuiz({ ...form, total_marks: Number(form.total_marks) });
      setSuccess('✅ Quiz created successfully! Students can now attempt it.');
      setForm({ title: '', description: '', total_marks: 100, class_name: '' });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">🧠 Add Quiz</h1>
        <p className="page-subtitle">Create a new quiz for your students to attempt.</p>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div className="card">
          {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>{success}</div>}
          {error   && <div className="alert alert-error"   style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Quiz Title</label>
              <input
                className="form-control"
                placeholder="e.g., Mid-Term Science Quiz — Chapter 4"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Brief description about the quiz, topics covered, instructions..."
                rows={5}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-control"
                required
                value={form.class_name}
                onChange={e => setForm({ ...form, class_name: e.target.value })}
              >
                <option value="">Select class</option>
                {[...Array(10)].map((_, idx) => (
                  <option key={idx} value={`${idx + 1}`}>
                    Class {idx + 1}
                  </option>
                ))}
                <option value="PGDCA">PGDCA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                min={1}
                max={500}
                required
                value={form.total_marks}
                onChange={e => setForm({ ...form, total_marks: e.target.value })}
              />
            </div>

            <div className="quiz-preview card" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#a78bfa' }}>Preview</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{form.title || 'Quiz Title'}</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {form.description || 'No description'}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-primary">Marks: {form.total_marks}</span>
                {form.class_name && (
                  <span className="badge badge-secondary">
                    Class: {form.class_name === 'PGDCA' ? 'PGDCA' : `Class ${form.class_name}`}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : '🚀 Create Quiz'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setForm({ title: '', description: '', total_marks: 100, class_name: '' }); setSuccess(''); setError(''); }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
