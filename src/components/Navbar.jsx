import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const courses = [
  ...Array.from({ length: 10 }, (_, i) => ({
    label: `Class ${i + 1}`,
    number: i + 1,
    to: `/courses/class-${i + 1}`,
  })),
  { label: 'PGDCA', number: 'P', to: '/courses/pgdca' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = () => {
    if (!user) return '/login';
    const map = { admin: '/dashboard/admin', teacher: '/dashboard/teacher', student: '/dashboard/student' };
    return map[user.role] || '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🎓</div>
          <span className="navbar-logo-text">Maa Kharakhai Ambitious Tutorial</span>
        </Link>

        {/* Desktop links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</NavLink></li>

          {/* Courses Dropdown */}
          <li className="dropdown-parent" ref={dropRef}>
            <button
              className={`dropdown-trigger ${coursesOpen ? 'active' : ''}`}
              onClick={() => setCoursesOpen(!coursesOpen)}
            >
              Courses <span className="chevron">{coursesOpen ? '▲' : '▼'}</span>
            </button>
            {coursesOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-grid">
                  {courses.map((course) => (
                    <Link
                      key={course.to}
                      to={course.to}
                      className="dropdown-item"
                      onClick={() => { setCoursesOpen(false); setMenuOpen(false); }}
                    >
                      <span className="dropdown-item-num">{course.number}</span>
                      <span>{course.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* CTA */}
        <div className="navbar-cta">
          {user ? (
            <div className="navbar-user-group">
              <Link to={dashboardLink()} className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
