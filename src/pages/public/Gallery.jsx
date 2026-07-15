import { useState } from 'react';
import './Gallery.css';

const galleryImages = [
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.09 AM.jpeg', alt: 'Campus classroom preview', label: 'Campus Trip' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.35.19 AM.jpeg', alt: 'Student study session', label: 'Student Group' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.35.18 AM.jpeg', alt: 'Tutorial class interaction', label: 'Class Team' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.10 AM (1).jpeg', alt: 'Group selfie with students', label: 'Selfie Group' },
  { src: '/images/WhatsApp Image 2026-07-14 at 11.39.10 AM (3).jpeg', alt: 'Student group with landmark', label: 'Night Group' },
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="gallery-page container">
      <section className="gallery-intro">
        <div className="gallery-copy">
          <span className="gallery-tag">Gallery</span>
          <h1>Explore Our Learning Spaces</h1>
          <p>
            A curated preview of the tutorial environment, class sessions, and student activities.
            Browse the visual highlights from our classrooms and interactive coaching moments.
          </p>
        </div>
      </section>

      <section className="gallery-grid">
        {galleryImages.map(({ src, alt, label }) => (
          <article key={src} className="gallery-card">
            <button type="button" className="gallery-card-media" onClick={() => setActiveImage({ src, alt, label })}>
              <img src={src} alt={alt} />
              <div className="gallery-card-overlay">
                <span>{label}</span>
              </div>
            </button>
          </article>
        ))}
      </section>

      {activeImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.label} onClick={() => setActiveImage(null)}>
          <button className="gallery-lightbox-close" type="button" aria-label="Close preview" onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}>
            ×
          </button>
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage.src} alt={activeImage.alt} />
            <div className="gallery-lightbox-caption">
              <strong>{activeImage.label}</strong>
              <p>{activeImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
