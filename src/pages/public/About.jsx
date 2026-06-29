import './About.css';

const values = [
  { icon: '⭐', title: 'Excellence', desc: 'We set high standards for every student and strive for academic excellence across all classes.' },
  { icon: '🤝', title: 'Collaboration', desc: 'Students, teachers, and admins work in harmony through our unified digital platform.' },
  { icon: '💡', title: 'Innovation', desc: 'We leverage technology to modernize education and make learning more engaging and effective.' },
  { icon: '❤️', title: 'Care', desc: 'Every student matters. We track progress, attendance, and well-being to ensure no one is left behind.' },
];

const team = [
  {
    name: 'Amarjeet Nayak',
    image: '/images/amarjeet-nayak.png',
  },
  {
    name: 'Biswajeet Nayak',
    image: '/images/biswajeet-nayak.png',
  },
  {
    name: 'Abhaya Muduli',
    image: '/images/abhaya.png',
  },
  {
    name: 'Sumitra Nayak',
    image: '/images/sumitra.png',
  },
  {
    name: 'Namita Jena',
    image: '/images/namita.png',
  },
  {
    name: 'Ankita Barik',
    image: '/images/ankita.png',
  },
];

const teamSlider = [...team, ...team];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-orb about-orb-1" />
          <div className="about-orb about-orb-2" />
        </div>
        <div className="container about-hero-content">
          <div className="section-badge">About Maa Kharakhai Ambitious Tutorial</div>
          <h1 className="about-title">
            Shaping <span className="gradient-text">Brilliant Minds</span><br />
            Since 2023
          </h1>
          <p className="about-subtitle">
            Maa Kharakhai Ambitious Tutorial brings together students, teachers, and administrators
            in one smooth learning experience. From Class 1 to Class 10 and PGDCA, we support every
            step of a student's academic journey.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-mission card">
            <div className="mission-icon">⭐</div>
            <div className="mission-content">
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-text">
                To make quality education accessible, measurable, and enjoyable for every student
                from Class 1 to Class 10 and PGDCA. We empower teachers with the right tools, give
                admins complete control, and ensure students always know where they stand in their
                academic journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">What Drives Us</div>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid grid-4">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="value-card card">
                <div className="value-icon">{icon}</div>
                <h3 className="value-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Meet the Team</div>
            <h2 className="section-title">The People Behind Maa Kharakhai Ambitious Tutorial</h2>
          </div>
          <div className="team-slider" aria-label="Team members">
            <div className="team-track">
            {teamSlider.map(({ name, image }, index) => (
              <div key={`${name}-${index}`} className="team-card card">
                <div className="team-avatar" aria-hidden="true">
                  <img src={image} alt={name} />
                </div>
                <h3 className="team-name">{name}</h3>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
