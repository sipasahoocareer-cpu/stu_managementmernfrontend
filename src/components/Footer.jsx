import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiBookOpen, FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column footer-brand">
            <Link to="/" className="footer-logo" aria-label="Maa Kharakhai Tutorial home">
              <span className="footer-logo-mark"><FiBookOpen /></span>
              <span>
                <span className="footer-logo-title">Maa Kharakhai</span>
                <span className="footer-logo-subtitle">Ambisious Tutorial</span>
              </span>
            </Link>

            <p className="footer-description">
              Focused coaching, caring guidance, and steady academic support for students
              near Balianta Gram Panchayat Office.
            </p>
            <p className="footer-tagline">Empowering education since 2023</p>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/courses">Courses</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Classes</h3>
            <ul className="footer-links">
              <li><Link to="/courses/class-1">Classes 1-5</Link></li>
              <li><Link to="/courses/class-6">Classes 6-8</Link></li>
              <li><Link to="/courses/class-9">Classes 9-10</Link></li>
              <li><Link to="/courses/pgdca">PGDCA</Link></li>
              <li><Link to="/courses">All Courses</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Contact Info</h3>
            <div className="footer-info">
              <p><span className="info-icon"><FiMapPin /></span> Balianta Gram Panchayat Office</p>
              <p><span className="info-icon"><FiMail /></span> contact@maakarakhai.com</p>
              <p><span className="info-icon"><FiPhone /></span> +91 7848026463</p>
              <p><span className="info-icon"><FiClock /></span> 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2023 - {year} Maa Kharakhai Ambisious Tutorial. All rights reserved.</p>

          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook" title="Facebook"><FaFacebookF /></a>
            <a href="#" className="social-icon" aria-label="X" title="X"><FaXTwitter /></a>
            <a href="#" className="social-icon" aria-label="Instagram" title="Instagram"><FaInstagram /></a>
            <a href="#" className="social-icon" aria-label="LinkedIn" title="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-legal">
          <a href="#privacy">Privacy Policy</a>
          <span className="separator">&middot;</span>
          <a href="#terms">Terms of Service</a>
          <span className="separator">&middot;</span>
          <a href="#sitemap">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
