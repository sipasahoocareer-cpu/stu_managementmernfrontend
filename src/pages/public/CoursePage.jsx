import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './CoursePage.css';

const classData = {
  1: { name: 'Class I', emoji: 'I', subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Studies', 'Drawing & Art'], desc: 'Foundation year building core literacy, numeracy, and curiosity through play-based learning.' },
  2: { name: 'Class II', emoji: 'II', subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Studies', 'Drawing & Art', 'Computer Basics'], desc: 'Expanding language skills, deeper mathematical concepts, and introduction to digital basics.' },
  3: { name: 'Class III', emoji: 'III', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Drawing & Art', 'Computer'], desc: 'Students begin exploring science and social studies alongside strengthened core subjects.' },
  4: { name: 'Class IV', emoji: 'IV', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'Computer'], desc: 'Deeper academic exploration with structured science experiments and history lessons.' },
  5: { name: 'Class V', emoji: 'V', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'Computer', 'Physical Education'], desc: 'A milestone year with comprehensive assessments and preparation for upper primary.' },
  6: { name: 'Class VI', emoji: 'VI', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'History', 'Geography', 'Civics', 'Sanskrit', 'Computer'], desc: 'Entry into upper primary with dedicated History, Geography and Civics subjects.' },
  7: { name: 'Class VII', emoji: 'VII', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'History', 'Geography', 'Civics', 'Sanskrit', 'Computer'], desc: 'Advanced science concepts including cells, matter, and natural phenomena.' },
  8: { name: 'Class VIII', emoji: 'VIII', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Civics', 'Sanskrit'], desc: 'Science splits into Physics, Chemistry and Biology. Algebra and geometry deepen.' },
  9: { name: 'Class IX', emoji: 'IX', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Computer Science'], desc: 'Secondary school begins. Board-pattern preparation across all major subjects.' },
  10: { name: 'Class X', emoji: 'X', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Computer Science', 'Physical Education'], desc: 'The final year of secondary school. Rigorous board exam preparation and career guidance.' },
  pgdca: {
    name: 'PGDCA',
    emoji: 'PC',
    subjects: ['Tally', 'MS Word', 'MS PowerPoint', 'Excel'],
    desc: 'A practical computer application program focusing on office productivity tools and accounting software for career readiness.',
  },
};

const subjectColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
  '#10b981', '#14b8a6', '#22d3ee', '#3b82f6', '#a855f7', '#84cc16',
];

export default function CoursePage() {
  const { classId } = useParams();
  useEffect(() => {
    // Ensure page scrolls to top when navigating between courses
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [classId]);
  const isPgdca = classId === 'pgdca';
  const classNum = parseInt(classId?.replace('class-', '') || '1', 10);
  const data = isPgdca ? classData.pgdca : classData[classNum] || classData[1];
  const prevClass = !isPgdca && classNum > 1 ? classNum - 1 : null;
  const nextClass = !isPgdca && classNum < 10 ? classNum + 1 : null;

  return (
    <div className="course-page">
      <section className="course-hero">
        <div className="course-hero-bg">
          <div className="course-hero-orb" />
        </div>
        <div className="container course-hero-content">
          <div className="course-hero-emoji">{data.emoji}</div>
          <div className="section-badge">Curriculum Overview</div>
          <h1 className="course-hero-title">{data.name}</h1>
          <p className="course-hero-desc">{data.desc}</p>
          <Link to="/login" className="btn btn-primary">
            Enroll Now
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Subjects Covered</h2>
            <p className="section-subtitle">
              {data.subjects.length} subjects designed to give a well-rounded education for {data.name}.
            </p>
          </div>
              <div className="subjects-grid">
                {data.subjects.map((sub, i) => {
                  const emojis = ['📘', '📗', '📕', '📙', '✏️', '🔬', '🗺️', '📐', '💻', '🎨', '⚽️'];
                  const emoji = emojis[i % emojis.length];
                  return (
                    <div
                      key={sub}
                      className="subject-card card"
                      style={{ '--sub-color': subjectColors[i % subjectColors.length] }}
                    >
                      <div className="subject-icon" style={{ background: subjectColors[i % subjectColors.length] }}>
                        {emoji}
                      </div>
                      <div className="subject-name">{sub}</div>
                    </div>
                  );
                })}
              </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Students Will Gain</h2>
          </div>
          <div className="grid grid-3">
            {[
              { icon: '⭐', title: 'Excellence', desc: 'We set high standards for every student and strive for academic excellence across all classes.' },
              { icon: '🤝', title: 'Collaboration', desc: 'Students, teachers, and admins work in harmony through our unified digital platform.' },
              { icon: '💡', title: 'Innovation', desc: 'We leverage technology to modernize education and make learning more engaging and effective.' },
              { icon: '❤️', title: 'Care', desc: 'Every student matters. We track progress, attendance, and well-being to ensure no one is left behind.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card feature-card">
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container course-nav">
          {prevClass ? (
            <Link to={`/courses/class-${prevClass}`} className="btn btn-secondary">
              Class {prevClass}
            </Link>
          ) : (
            <div />
          )}

          <Link to="/login" className="btn btn-primary">
            Join {data.name}
          </Link>

          {nextClass ? (
            <Link to={`/courses/class-${nextClass}`} className="btn btn-secondary">
              Class {nextClass}
            </Link>
          ) : isPgdca ? (
            <Link to="/courses/class-1" className="btn btn-secondary">
              View Classes
            </Link>
          ) : (
            <Link to="/courses/pgdca" className="btn btn-secondary">
              PGDCA
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
