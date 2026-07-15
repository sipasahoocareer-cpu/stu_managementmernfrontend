import { useState, useEffect } from 'react';
import './MediaAside.css';

export default function MediaAside({ imageSrc = '/images/hero_img.jpeg', alt = 'Highlight' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <aside className="media-aside">
      <button
        type="button"
        className="media-card"
        onClick={() => setOpen(true)}
        aria-label="Open media"
      >
        <div className="media-frame">
          <img className="media-img" src={imageSrc} alt={alt} />
        </div>

        <div className="media-overlay media-overlay--subtle">
          <span className="media-overlay-label">Play highlight</span>
        </div>
      </button>

      {open && (
        <div className="media-lightbox" role="dialog" aria-modal="true">
          <div className="media-lightbox-backdrop" onClick={() => setOpen(false)} />
          <div className="media-lightbox-content">
            <img className="media-lightbox-img" src={imageSrc} alt={alt} />
            <button className="media-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
        </div>
      )}
    </aside>
  );
}
