import { useState } from 'react';
import { FiClock, FiMail, FiMapPin, FiMessageSquare, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import { submitQuery } from '../../api';
import './Contact.css';

const contactInfo = [
  { icon: <FiMapPin />, label: 'Address', value: 'In front of Balianta Gram Panchayat Office, Balianta' },
  { icon: <FiPhone />, label: 'Phone', value: '+91 7848026463' },
  { icon: <FiMail />, label: 'Email', value: 'contact@maakarakhai.com' },
  { icon: <FiClock />, label: 'Hours', value: 'Mon-Sat: 9:00 AM - 6:00 PM' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', contactNumber: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitQuery({ ...form, email: '' });
      setSubmitted(true);
      setForm({ name: '', contactNumber: '', message: '' });
    } catch (err) {
      console.error('Failed to submit query:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: '', contactNumber: '', message: '' });
    setError('');
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <div className="contact-eyebrow">Contact Us</div>
          <h1>Talk To Maa Kharakhai Ambitious Tutorial</h1>
          <p>
            Share your question, admission query, or course interest. We will reach out and help
            you with the next step.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-info-panel">
            <h2>Contact Information</h2>
            <p className="contact-info-intro">
              Visit us near Balianta Gram Panchayat Office or call during working hours.
            </p>

            <div className="contact-info-list">
              {contactInfo.map(({ icon, label, value }) => (
                <div key={label} className="contact-info-card">
                  <span className="contact-info-icon">{icon}</span>
                  <span>
                    <span className="contact-info-label">{label}</span>
                    <span className="contact-info-value">{value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon"><FiSend /></div>
                <h2>Message Sent</h2>
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
                  <label className="contact-form-group" htmlFor="contact-name">
                    <span><FiUser /> Name</span>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </label>

                  <label className="contact-form-group" htmlFor="contact-phone">
                    <span><FiPhone /> Phone Number</span>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={form.contactNumber}
                      onChange={(e) => updateField('contactNumber', e.target.value)}
                    />
                  </label>
                </div>

                <label className="contact-form-group" htmlFor="contact-query">
                  <span><FiMessageSquare /> Query</span>
                  <textarea
                    id="contact-query"
                    required
                    placeholder="Write your query here"
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
