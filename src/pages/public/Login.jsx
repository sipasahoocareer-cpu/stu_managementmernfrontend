import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form.identifier.trim(), form.password.trim());
      const map = { admin: '/dashboard/admin', teacher: '/dashboard/teacher', student: '/dashboard/student' };
      const role = user.role?.toLowerCase() || 'student';
      navigate(map[role] || '/dashboard/student');
    } catch (err) {
      if (!err?.response) {
        setError('Cannot reach the backend on http://localhost:8000. Start the API server first.');
        return;
      }

      const detail = err?.response?.data?.detail || err?.response?.data?.message;
      if (detail && typeof detail === 'string') {
        setError(detail);
      } else if (err.response.status === 401) {
        setError('Invalid name or password. Please enter your registered name and password.');
      } else {
        setError('Login failed. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="golden-login">
      <div className="golden-login-container">
        <div className="golden-login-card">
          <div className="golden-login-header">
            <div className="golden-login-mark"><FiLogIn /></div>
            <p className="golden-login-eyebrow">Maa Kharakhai Ambitious Tutorial</p>
            <h1 className="golden-login-title">Portal Login</h1>
          </div>

          {error && <div className="golden-error">{error}</div>}

          <form onSubmit={handleSubmit} className="golden-login-form">
            <div className="golden-form-group">
              <label className="golden-form-label" htmlFor="login-identifier">
                Name
              </label>
              <div className="golden-input-wrapper">
                <span className="golden-input-icon"><FiUser /></span>
                <input
                  id="login-identifier"
                  type="text"
                  placeholder="Enter your name"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                  className="golden-input"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="golden-form-group">
              <label className="golden-form-label" htmlFor="login-password">Password</label>
              <div className="golden-input-wrapper">
                <span className="golden-input-icon"><FiLock /></span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="golden-input"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="golden-btn" disabled={loading} id="login-submit-btn">
              <FiLogIn /> {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="golden-back-link">
            <Link to="/"><FiArrowLeft /> Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
