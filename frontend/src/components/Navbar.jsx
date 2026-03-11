import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. 🙏 Jai Shri Ram!');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar-darshan">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand-darshan" onClick={closeMenu}>
            🛕 Darshan<span>Ease</span>
          </Link>

          {/* Hamburger */}
          <button
            className="d-lg-none"
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={() => setMenuOpen(!menuOpen)}
            id="navbar-toggle"
          >
            <i className={`bi bi-${menuOpen ? 'x-lg' : 'list'}`}></i>
          </button>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <Link to="/" className={`nav-link-darshan ${isActive('/')}`}>Home</Link>
            <Link to="/temples" className={`nav-link-darshan ${isActive('/temples')}`}>Temples</Link>
            {user && (
              <>
                <Link to="/my-bookings" className={`nav-link-darshan ${isActive('/my-bookings')}`}>My Bookings</Link>
                <Link to="/donate" className={`nav-link-darshan ${isActive('/donate')}`}>Donate</Link>
              </>
            )}
            {isAdmin() && (
              <Link to="/admin" className={`nav-link-darshan ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                <i className="bi bi-shield-lock me-1"></i>Admin
              </Link>
            )}
            {isOrganizer() && (
              <Link to="/organizer" className={`nav-link-darshan ${location.pathname.startsWith('/organizer') ? 'active' : ''}`}>
                <i className="bi bi-building me-1"></i>Organizer
              </Link>
            )}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn-outline-darshan dropdown-toggle"
                  data-bs-toggle="dropdown"
                  id="user-dropdown"
                  style={{ border: '2px solid rgba(200,119,58,0.5)' }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ borderRadius: '12px', border: '1px solid #e0d8cc', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <li><span className="dropdown-item-text text-muted" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/profile" onClick={closeMenu}><i className="bi bi-person me-2"></i>Profile</Link></li>
                  <li><Link className="dropdown-item" to="/my-bookings" onClick={closeMenu}><i className="bi bi-ticket-perforated me-2"></i>My Bookings</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline-darshan" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>Login</Link>
                <Link to="/register" className="btn-darshan" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="d-lg-none mt-3 pb-2 fade-in">
            <Link to="/" className={`nav-link-darshan d-block ${isActive('/')}`} onClick={closeMenu}>Home</Link>
            <Link to="/temples" className={`nav-link-darshan d-block ${isActive('/temples')}`} onClick={closeMenu}>Temples</Link>
            {user && (
              <>
                <Link to="/my-bookings" className={`nav-link-darshan d-block ${isActive('/my-bookings')}`} onClick={closeMenu}>My Bookings</Link>
                <Link to="/donate" className={`nav-link-darshan d-block ${isActive('/donate')}`} onClick={closeMenu}>Donate</Link>
              </>
            )}
            {isAdmin() && <Link to="/admin" className="nav-link-darshan d-block" onClick={closeMenu}>Admin Panel</Link>}
            {isOrganizer() && <Link to="/organizer" className="nav-link-darshan d-block" onClick={closeMenu}>Organizer Panel</Link>}
            <div className="d-flex gap-2 mt-2">
              {user ? (
                <button className="btn-darshan flex-fill" onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link to="/login" className="btn-outline-darshan flex-fill text-center" onClick={closeMenu} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Login</Link>
                  <Link to="/register" className="btn-darshan flex-fill text-center" onClick={closeMenu} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
