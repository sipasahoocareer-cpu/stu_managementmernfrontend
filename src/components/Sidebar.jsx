import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const studentLinks = [
  { to: '/dashboard/student',           icon: '🏠', label: 'Home' },
  { to: '/dashboard/student/result',    icon: '📊', label: 'View Result' },
  { to: '/dashboard/student/attendance',icon: '📅', label: 'Attendance' },
  { to: '/dashboard/student/notes',     icon: '📝', label: 'My Notes' },
  { to: '/dashboard/student/quiz',      icon: '🧠', label: 'Attend Quiz' },
];

const teacherLinks = [
  { to: '/dashboard/teacher',              icon: '🏠', label: 'Home' },
  { to: '/dashboard/teacher/add-note',     icon: '📝', label: 'Add Note' },
  { to: '/dashboard/teacher/view-notes',   icon: '📚', label: 'Manage Notes' },
  { to: '/dashboard/teacher/quiz',         icon: '🧠', label: 'Add Quiz' },
  { to: '/dashboard/teacher/manage-quizzes', icon: '🗂️', label: 'Review Quizzes' },
  { to: '/dashboard/teacher/attendance',   icon: '📅', label: 'Add Attendance' },
  { to: '/dashboard/teacher/marks',        icon: '✅', label: 'Add Marks' },
];

const adminLinks = [
  { to: '/dashboard/admin',              icon: '🏠', label: 'Home' },
  { to: '/dashboard/admin/students',     icon: '👨‍🎓', label: 'Student Details' },
  { to: '/dashboard/admin/teachers',     icon: '👨‍🏫', label: 'Teacher Details' },
  { to: '/dashboard/admin/queries',      icon: '💬', label: 'Contact Queries' },
];

const linksByRole = { student: studentLinks, teacher: teacherLinks, admin: adminLinks };

const roleColors = {
  student: 'var(--color-accent-teal)',
  teacher: 'var(--color-accent-secondary)',
  admin:   'var(--color-accent-secondary)',
};

const roleLabels = { student: 'Student', teacher: 'Teacher', admin: 'Admin' };

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const links = linksByRole[user?.role] || [];
  const color = roleColors[user?.role] || 'var(--color-accent-primary)';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar" style={{ background: color }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        {!collapsed && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-role" style={{ color }}>
              {roleLabels[user?.role] || user?.role}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? label : ''}
            >
              <span className="sidebar-icon">{icon}</span>
              {!collapsed && <span className="sidebar-label">{label}</span>}
              {isActive && <span className="sidebar-active-bar" />}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button */}
      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? '→' : '←'}
      </button>
    </aside>
  );
}
