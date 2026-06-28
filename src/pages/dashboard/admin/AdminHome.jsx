import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminHome.css';

export default function AdminHome() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/dashboard/admin/students', icon: 'S', label: 'View Students', color: '#8b5cf6' },
    { to: '/dashboard/admin/teachers', icon: 'T', label: 'Manage Teachers', color: '#a78bfa' },
    { to: '/dashboard/admin/queries', icon: 'Q', label: 'Contact Queries', color: '#10b981' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="admin-welcome">
        <div className="admin-welcome-bg" />
        <div className="admin-welcome-content">
          <div>
            <h1 className="admin-welcome-title">
              Admin Dashboard, <span className="welcome-name-white">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="admin-welcome-sub">Choose a section to manage.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-4">
          {quickLinks.map(({ to, icon, label, color }) => (
            <Link key={label} to={to} className="card card-hover" style={{ '--card-color': color }}>
              <div className="quick-action-icon" style={{ background: color }}>{icon}</div>
              <div className="quick-action-label">{label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
