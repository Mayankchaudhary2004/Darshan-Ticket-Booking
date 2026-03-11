import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🛕', title: 'Explore Temples', desc: 'Browse hundreds of sacred temples across India with detailed information and photos.' },
  { icon: '📅', title: 'Book Darshan Slots', desc: 'Select your preferred time slot and pooja type. Confirm your booking instantly.' },
  { icon: '🎫', title: 'Digital Tickets', desc: 'Receive unique booking references. No more standing in long queues at the temple.' },
  { icon: '💛', title: 'Make Donations', desc: 'Contribute to temple maintenance, festivals, and charitable causes with ease.' },
  { icon: '📱', title: 'Manage Bookings', desc: 'View, track, and cancel your bookings anytime from any device.' },
  { icon: '🔐', title: 'Secure & Trusted', desc: 'Enterprise-grade security with JWT authentication and encrypted data storage.' },
];

const temples = [
  { name: 'Tirupati Balaji', location: 'Tirupati, Andhra Pradesh', deity: 'Lord Venkateswara', emoji: '🙏', color: '#ffd700' },
  { name: 'Vaishno Devi', location: 'Katra, Jammu & Kashmir', deity: 'Mata Vaishno Devi', emoji: '⛰️', color: '#c8773a' },
  { name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', deity: 'Lord Shiva', emoji: '🔱', color: '#aa6bcc' },
  { name: 'Shirdi Sai Baba', location: 'Shirdi, Maharashtra', deity: 'Sai Baba', emoji: '✨', color: '#28a745' },
  { name: 'Jagannath Puri', location: 'Puri, Odisha', deity: 'Lord Jagannath', emoji: '🎪', color: '#dc3545' },
  { name: 'Meenakshi Amman', location: 'Madurai, Tamil Nadu', deity: 'Goddess Meenakshi', emoji: '🌺', color: '#fd7e14' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 hero-content fade-in">
              <div className="section-tag">🙏 Digital Darshan Platform</div>
              <h1 className="hero-title mt-3">
                Your Spiritual Journey <span className="highlight">Begins Here</span>
              </h1>
              <p className="hero-subtitle">
                DarshanEase makes temple visits seamless. Browse sacred temples, book darshan slots, 
                and manage your spiritual journey — all from the comfort of your home.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/temples" className="btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }}>
                  <i className="bi bi-search me-2"></i>Explore Temples
                </Link>
                {!user && (
                  <Link to="/register" className="btn-outline-darshan" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', fontSize: '1rem', padding: '0.85rem 2.25rem' }}>
                    <i className="bi bi-person-plus me-2"></i>Join Free
                  </Link>
                )}
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="number">500+</div>
                  <div className="label">Temples</div>
                </div>
                <div className="hero-stat">
                  <div className="number">50K+</div>
                  <div className="label">Devotees</div>
                </div>
                <div className="hero-stat">
                  <div className="number">2L+</div>
                  <div className="label">Bookings</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="hero-image-wrapper">
                <div style={{
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(200,119,58,0.3), rgba(255,215,0,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12rem',
                  border: '2px solid rgba(200,119,58,0.3)',
                  boxShadow: '0 0 80px rgba(200,119,58,0.2), inset 0 0 60px rgba(255,215,0,0.05)'
                }}>
                  🛕
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <div className="container py-4">
          <div className="section-header fade-in">
            <div className="section-tag">Why DarshanEase</div>
            <h2 className="section-title">Everything You Need for a<br />Smooth Spiritual Visit</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4 fade-in">
                <div className="feature-card">
                  <div className="feature-icon">
                    <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
                  </div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: '0.75rem' }}>{f.title}</h5>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Temples */}
      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container py-4">
          <div className="section-header">
            <div className="section-tag">Sacred Places</div>
            <h2 className="section-title">Popular Temples Across India</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <div className="row g-4">
            {temples.map((t, i) => (
              <div key={i} className="col-md-6 col-lg-4 fade-in">
                <div className="temple-card">
                  <div className="temple-card-img-placeholder" style={{ background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)` }}>
                    <span>{t.emoji}</span>
                  </div>
                  <div className="temple-card-body">
                    <h5 className="temple-card-title">{t.name}</h5>
                    <p className="temple-card-location">
                      <i className="bi bi-geo-alt-fill" style={{ color: 'var(--primary)' }}></i>
                      {t.location}
                    </p>
                    <span className="temple-card-badge">{t.deity}</span>
                    <div className="mt-3">
                      <Link to="/temples" className="btn-darshan" style={{ fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}>
                        Book Darshan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/temples" className="btn-outline-darshan" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
              <i className="bi bi-grid me-2"></i>View All Temples
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(135deg, #1a1025, #2d1f42)', padding: '5rem 0' }}>
        <div className="container text-center fade-in">
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🙏</div>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            Start Your Spiritual Journey Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Join over 50,000 devotees who have simplified their temple visits with DarshanEase.
          </p>
          {!user ? (
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register" className="btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
                <i className="bi bi-person-plus me-2"></i>Create Free Account
              </Link>
              <Link to="/temples" className="btn-outline-darshan" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
                <i className="bi bi-search me-2"></i>Browse Temples
              </Link>
            </div>
          ) : (
            <Link to="/temples" className="btn-gold" style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}>
              <i className="bi bi-ticket-perforated me-2"></i>Book a Darshan
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
