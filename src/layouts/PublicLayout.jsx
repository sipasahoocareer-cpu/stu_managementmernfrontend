import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppWidget from '../components/WhatsAppWidget';
import './PublicLayout.css';

export default function PublicLayout() {
  const [showWelcomePoster, setShowWelcomePoster] = useState(true);

  useEffect(() => {
    if (!showWelcomePoster) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowWelcomePoster(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWelcomePoster]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />

      {showWelcomePoster && (
        <div
          className="welcome-poster-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Admission banner"
          onClick={() => setShowWelcomePoster(false)}
        >
          <div className="welcome-poster-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="welcome-poster-close"
              aria-label="Close admission banner"
              onClick={() => setShowWelcomePoster(false)}
            >
              ×
            </button>
            <img
              className="welcome-poster-image"
              src="/images/banner.jpeg"
              alt="Maa Kharakhai Ambitious Tutorial admission banner"
            />
          </div>
        </div>
      )}
    </>
  );
}
