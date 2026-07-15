import { useState } from 'react';
import { FiClock, FiMail, FiMapPin, FiMessageSquare, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import { submitQuery } from '../../api';
import './Contact.css';
import './PageLayout.css';

const contactInfo = [
  { icon: <FiMapPin />, label: 'Address', value: 'In front of Balianta Gram Panchayat Office, Balianta' },
  { icon: <FiPhone />, label: 'Phone', value: '+91 7848026463' },
  { icon: <FiMail />, label: 'Email', value: 'contact@maakarakhai.com' },
  { icon: <FiClock />, label: 'Hours', value: 'Mon-Sat: 9:00 AM - 6:00 PM' },
];

// Validates Indian mobile number: 10 digits, starts with 6-9
function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Allow optional country code +91 or 0
  const digits = cleaned.replace(/^(91|0)/, '');
  return /^[6-9]\d{9}$/.test(digits);
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', contactNumber: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    // Clear phone error when user starts typing phone again
    if (field === 'contactNumber') setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPhoneError('');

    // Phone validation
    if (!validatePhone(form.contactNumber)) {
      setPhoneError('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    try {
      await submitQuery({
        name: form.name,
        email: '',
        subject: form.contactNumber,   // backend uses "subject" field for phone number
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: '', contactNumber: '', message: '' });
    } catch (err) {
      console.error('Failed to submit query:', err);
      const detail = err?.response?.data?.detail;
      setError(detail || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: '', contactNumber: '', message: '' });
    setError('');
    setPhoneError('');
  };

  return (
    <div className="contact-page page-wrapper">
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="about-orb about-orb-1" />
          <div className="about-orb about-orb-2" />
        </div>
        <div className="page-hero-content">
          <span className="page-hero-badge">Contact Us</span>
          <h1 className="page-hero-title">
            Talk To <span className="gradient-text">Maa Kharakhai</span><br />
            Ambisious Tutorial
          </h1>
          <p className="page-hero-subtitle">
            Share your question, admission query, or course interest. We will reach out and help
            you with the next step.
          </p>
        </div>
      </section>

      <section className="contact-content page-content">
        <div className="page-content-inner contact-grid">
          <div className="contact-info-panel">
            <h2>Contact Information</h2>
            <p className="contact-info-intro">
              Visit us near Balianta Gram Panchayat Office or call during working hours.
            </p>

            <div className="contact-info-list">
              {contactInfo.map(({ icon, label, value }) => {
                // create appropriate hrefs for phone, email and address
                let content = null;
                if (label === 'Phone') {
                  // normalize number for tel: (remove spaces)
                  const tel = value.replace(/\s+/g, '');
                  content = (
                    <a href={`tel:${tel}`} className="contact-info-link" aria-label={`Call ${tel}`}>
                      {value}
                    </a>
                  );
                } else if (label === 'Email') {
                  content = (
                    <a href={`mailto:${value}`} className="contact-info-link" aria-label={`Email ${value}`}>
                      {value}
                    </a>
                  );
                } else if (label === 'Address') {
                  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
                  content = (
                    <a href={maps} target="_blank" rel="noreferrer noopener" className="contact-info-link" aria-label={`Open map for ${value}`}>
                      {value}
                    </a>
                  );
                } else {
                  content = <span className="contact-info-value">{value}</span>;
                }

                return (
                  <div key={label} className="contact-info-card">
                    <span className="contact-info-icon">{icon}</span>
                    <span>
                      <span className="contact-info-label">{label}</span>
                      {content}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon"><FiSend /></div>
                <h2>Message Sent!</h2>
                <p>Thank you for contacting us. Our team will get back to you soon.</p>
                <button className="contact-submit-btn" onClick={handleReset}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div>
                  <h2>Send Message</h2>
                  <p>Fill in your details and write your query below.</p>
                </div>

                {error && <div className="contact-error">{error}</div>}

                <div className="contact-form-row">
                  {/* Name */}
                  <label className="contact-form-group" htmlFor="contact-name">
                    <span><FiUser /> Name</span>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </label>

                  {/* Phone */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-phone">
                      <span><FiPhone /> Phone Number</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={form.contactNumber}
                      onChange={(e) => updateField('contactNumber', e.target.value)}
                      style={{
                        borderColor: phoneError ? '#ef4444' : undefined,
                        outline: phoneError ? '1px solid #ef4444' : undefined,
                      }}
                    />
                    {phoneError && (
                      <span style={{
                        color: '#ef4444',
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block',
                      }}>
                        ⚠ {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <label className="contact-form-group" htmlFor="contact-query">
                  <span><FiMessageSquare /> Query / Message</span>
                  <textarea
                    id="contact-query"
                    required
                    rows={5}
                    placeholder="Write your query here..."
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                  />
                </label>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
