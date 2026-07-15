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

const galleryImages = [
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.09 AM.jpeg', alt: 'Campus classroom preview', label: 'Campus Trip' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.35.19 AM.jpeg', alt: 'Student study session', label: 'Student Group' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.35.18 AM.jpeg', alt: 'Tutorial class interaction', label: 'Class Team' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.10 AM (1).jpeg', alt: 'Group selfie with students', label: 'Selfie Group' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.10 AM (3).jpeg', alt: 'Student group with landmark', label: 'Night Group' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const dropRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setCoursesOpen(false);
      }
      if (galleryRef.current && !galleryRef.current.contains(e.target)) {
        setGalleryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMenus = () => {
    setCoursesOpen(false);
    setGalleryOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleCourses = () => {
    setCoursesOpen((open) => !open);
    setGalleryOpen(false);
  };

  const toggleGallery = () => {
    setGalleryOpen((open) => !open);
    setCoursesOpen(false);
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
          <div className="navbar-logo-icon">
            <img src="/images/ma-kharakhai-logo.svg" alt="Maa Kharakhai Ambisious Tutorial logo" />
          </div>
          <span className="navbar-logo-text">Maa Kharakhai Ambisious Tutorial</span>
        </Link>

        {/* Desktop links */}
        <ul id="main-navigation" className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
          <li className="dropdown-parent" ref={galleryRef}>
            <div className={`dropdown-trigger ${galleryOpen ? 'active' : ''}`}>
              <NavLink
                to="/gallery"
                className="courses-main-link"
                onClick={() => { closeMenus(); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Gallery
              </NavLink>
              <button
                className="courses-toggle"
                aria-label="Toggle gallery menu"
                aria-expanded={galleryOpen}
                aria-controls="gallery-menu"
                onClick={(e) => { e.stopPropagation(); toggleGallery(); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 8 }}
              >
                <span className="chevron">{galleryOpen ? '▲' : '▼'}</span>
              </button>
            </div>
            {galleryOpen && (
              <div id="gallery-menu" className="dropdown-menu gallery-menu">
                <div className="dropdown-sheet-header" style={{ padding: '8px 12px' }}>
                  <strong style={{ fontSize: 14 }}>Featured Gallery</strong>
                  <button className="sheet-close" aria-label="Close gallery" onClick={() => setGalleryOpen(false)}>✕</button>
                </div>
                <div className="gallery-preview-grid">
                  {galleryImages.map((image) => (
                    <Link
                      key={image.src}
                      to="/gallery"
                      className="gallery-preview-card"
                      onClick={closeMenus}
                    >
                      <div className="gallery-preview-thumb">
                        <img src={image.src} alt={image.alt} />
                      </div>
                      <span>{image.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
          <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</NavLink></li>

          {/* Courses Dropdown (click label to navigate to /courses; small chevron toggles dropdown) */}
          <li className="dropdown-parent" ref={dropRef}>
            <div className={`dropdown-trigger ${coursesOpen ? 'active' : ''}`}>
              <button
                className="courses-main-link"
                onClick={toggleCourses}
                aria-expanded={coursesOpen}
                aria-controls="courses-menu"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Courses
              </button>
              <button
                className="courses-toggle"
                aria-label="Toggle courses menu"
                aria-expanded={coursesOpen}
                aria-controls="courses-menu"
                onClick={(e) => { e.stopPropagation(); toggleCourses(); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 8 }}
              >
                <span className="chevron">{coursesOpen ? '▲' : '▼'}</span>
              </button>
            </div>
            {coursesOpen && (
              <div id="courses-menu" className="dropdown-menu">
                <div className="dropdown-sheet-header" style={{ padding: '8px 12px' }}>
                  <strong style={{ fontSize: 14 }}>Browse Classes</strong>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link to="/courses" onClick={() => { setCoursesOpen(false); setMenuOpen(false); }} style={{ fontSize: 13 }}>View All</Link>
                    <button className="sheet-close" aria-label="Close classes" onClick={() => setCoursesOpen(false)}>✕</button>
                  </div>
                </div>
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

          {/* Mobile CTA - shown in menu on mobile */}
          <li className="mobile-cta-section">
            {user ? (
              <div className="mobile-user-group">
                <Link to={dashboardLink()} className="mobile-cta-link mobile-dashboard" onClick={() => setMenuOpen(false)}>
                  📊 Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-cta-link mobile-logout">
                  🚪 Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="mobile-cta-link mobile-login" onClick={() => setMenuOpen(false)}>
                🔐 Login
              </Link>
            )}
          </li>
        </ul>

        {/* Desktop CTA */}
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

        {/* Menu toggle (kebab/3-dot menu) - accessible */}
        <button
          className={`hamburger kebab ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Close main menu' : 'Open main menu'}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
