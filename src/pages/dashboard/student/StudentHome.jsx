import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './StudentHome.css';

export default function StudentHome() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/dashboard/student/result', icon: 'R', label: 'View Results', color: '#6366f1' },
    { to: '/dashboard/student/attendance', icon: 'A', label: 'Attendance', color: '#14b8a6' },
    { to: '/dashboard/student/notes', icon: 'N', label: 'My Notes', color: '#8b5cf6' },
    { to: '/dashboard/student/quiz', icon: 'Q', label: 'Attend Quiz', color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="student-welcome">
        <div className="student-welcome-bg" />
        <div className="student-welcome-content">
          <div>
            <h1 className="student-welcome-title">
              Welcome back, <span className="welcome-name-white">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="student-welcome-sub">Choose what you want to open.</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h2 className="page-title">Quick Access</h2>
      </div>

      <div className="grid grid-4">
        {quickLinks.map(({ to, icon, label, color }) => (
          <Link key={to} to={to} className="student-quick-card" style={{ '--ql-color': color }}>
            <div className="student-quick-icon" style={{ background: `${color}22`, color }}>
              {icon}
            </div>
            <div className="student-quick-label">{label}</div>
            <div className="student-quick-arrow" style={{ color }}>-&gt;</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
