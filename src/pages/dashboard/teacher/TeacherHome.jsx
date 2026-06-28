import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherHome() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/dashboard/teacher/add-note', label: 'Add PDF Note', short: 'PDF', color: '#6366f1' },
    { to: '/dashboard/teacher/view-notes', label: 'Manage Notes', short: 'M', color: '#10b981' },
    { to: '/dashboard/teacher/quiz', label: 'Add Quiz', short: 'Q', color: '#8b5cf6' },
    { to: '/dashboard/teacher/manage-quizzes', label: 'Review Quizzes', short: 'R', color: '#ec4899' },
    { to: '/dashboard/teacher/attendance', label: 'Add Attendance', short: 'A', color: '#14b8a6' },
    { to: '/dashboard/teacher/marks', label: 'Add Marks', short: 'M', color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="student-welcome">
        <div className="student-welcome-bg" />
        <div className="student-welcome-content">
          <div>
            <h1 className="student-welcome-title">
              Good day, <span className="welcome-name-white">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="student-welcome-sub">Choose what you want to manage.</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h2 className="page-title">Quick Actions</h2>
      </div>
      <div className="grid grid-4">
        {quickLinks.map(({ to, short, label, color }) => (
          <Link key={to} to={to} className="student-quick-card" style={{ '--ql-color': color }}>
            <div className="student-quick-icon" style={{ background: `${color}22`, color }}>{short}</div>
            <div className="student-quick-label">{label}</div>
            <div className="student-quick-arrow" style={{ color }}>-&gt;</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
