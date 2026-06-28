import logo from '../assets/whatsapp-logo.svg';
import './WhatsAppWidget.css';

export default function WhatsAppWidget() {
  return (
    <div className="whatsapp-widget">
      <a
        href="https://api.whatsapp.com/send?phone=6371723216"
        target="_blank"
        rel="noreferrer noopener"
        className="whatsapp-widget-link"
        aria-label="Chat on WhatsApp"
      >
        <img src={logo} alt="WhatsApp" className="whatsapp-icon" />
      </a>
    </div>
  );
}
