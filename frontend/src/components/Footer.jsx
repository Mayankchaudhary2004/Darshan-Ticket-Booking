import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-darshan">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-brand">🛕 DarshanEase</div>
            <p className="footer-desc">
              Your digital gateway to spiritual journeys. Book darshan slots, make donations, and manage your temple visits with ease.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'instagram', 'twitter', 'youtube'].map(s => (
                <a key={s} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.target.style.color = '#c8773a'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                  <i className={`bi bi-${s}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-sm-4 col-lg-2 offset-lg-1">
            <h6 className="footer-heading">Quick Links</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/temples" className="footer-link">Explore Temples</Link>
            <Link to="/my-bookings" className="footer-link">My Bookings</Link>
            <Link to="/donate" className="footer-link">Donations</Link>
          </div>

          <div className="col-sm-4 col-lg-2">
            <h6 className="footer-heading">Account</h6>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/profile" className="footer-link">My Profile</Link>
          </div>

          <div className="col-sm-4 col-lg-3">
            <h6 className="footer-heading">Contact</h6>
            <p className="footer-link" style={{ cursor: 'default' }}>
              <i className="bi bi-envelope me-2"></i>support@darshanease.in
            </p>
            <p className="footer-link" style={{ cursor: 'default' }}>
              <i className="bi bi-telephone me-2"></i>+91 98765 43210
            </p>
            <p className="footer-link" style={{ cursor: 'default' }}>
              <i className="bi bi-geo-alt me-2"></i>India
            </p>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="mb-0">© 2026 DarshanEase. All rights reserved. 🙏</p>
          <p className="mb-0">Made with ❤️ for devotees across India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
