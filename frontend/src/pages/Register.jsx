import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const res = await register(submitData);
      toast.success(`🙏 Welcome to DarshanEase, ${res.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="auth-card fade-in">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🙏</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Create Account</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join thousands of devotees on DarshanEase</p>
              </div>

              <form onSubmit={handleSubmit} id="register-form">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label-darshan">Full Name *</label>
                    <input type="text" name="name" id="reg-name" className="form-control-darshan" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Email Address *</label>
                    <input type="email" name="email" id="reg-email" className="form-control-darshan" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Phone Number</label>
                    <input type="tel" name="phone" id="reg-phone" className="form-control-darshan" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Password *</label>
                    <input type="password" name="password" id="reg-password" className="form-control-darshan" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Confirm Password *</label>
                    <input type="password" name="confirmPassword" id="reg-confirm-password" className="form-control-darshan" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label-darshan">Register As</label>
                    <select name="role" id="reg-role" className="form-control-darshan" value={form.role} onChange={handleChange}>
                      <option value="USER">Devotee (User)</option>
                      <option value="ORGANIZER">Temple Organizer</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" id="register-submit" className="btn-darshan w-100" disabled={loading}
                      style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                      ) : (
                        <><i className="bi bi-person-check me-2"></i>Create Account</>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center mt-4">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
