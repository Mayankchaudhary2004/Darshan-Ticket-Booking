import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      toast.success(`🙏 Welcome back, ${res.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="auth-card fade-in">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛕</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue your spiritual journey</p>
              </div>

              <form onSubmit={handleSubmit} id="login-form">
                <div className="mb-3">
                  <label className="form-label-darshan">Email Address</label>
                  <div className="position-relative">
                    <input
                      type="email"
                      name="email"
                      id="login-email"
                      className="form-control-darshan"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '2.75rem' }}
                    />
                    <i className="bi bi-envelope position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-darshan">Password</label>
                  <div className="position-relative">
                    <input
                      type="password"
                      name="password"
                      id="login-password"
                      className="form-control-darshan"
                      placeholder="Your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '2.75rem' }}
                    />
                    <i className="bi bi-lock position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                  </div>
                </div>

                <button type="submit" id="login-submit" className="btn-darshan w-100" disabled={loading}
                  style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div style={{ background: 'rgba(200,119,58,0.08)', borderRadius: '10px', padding: '1rem', marginTop: '1.5rem', border: '1px dashed rgba(200,119,58,0.3)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  <i className="bi bi-info-circle me-1"></i>Demo Credentials
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                  Admin: <strong>admin@darshanease.in</strong> / <strong>admin123</strong><br />
                  User: Register a new account below
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
