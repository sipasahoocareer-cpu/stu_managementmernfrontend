import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

/**
 * Signup is disabled – students are added by Admin only.
 * This component immediately redirects to /login.
 */
export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="golden-login">
      <nav className="login-navbar">
        <div className="login-navbar-brand">📚 Student Portal</div>
        <ul className="login-navbar-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
        </ul>
      </nav>
      <div className="golden-login-container">
        <div className="golden-login-right" style={{ textAlign: 'center' }}>
          <p style={{ color: '#7c3aed', fontWeight: 600 }}>
            Redirecting to Login...
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: 8 }}>
            Student accounts are created by the Admin only.
          </p>
          <Link to="/login" className="golden-btn" style={{ display: 'inline-block', marginTop: 16 }}>
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
