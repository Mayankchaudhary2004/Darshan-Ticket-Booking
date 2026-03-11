import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  const roleColors = { USER: '#4e73df', ADMIN: '#dc3545', ORGANIZER: '#1cc88a' };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="section-tag">Account</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>My Profile</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem', color: 'white' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{user?.name}</h5>
              <span style={{ background: roleColors[user?.role] + '22', color: roleColors[user?.role], padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700 }}>
                {user?.role}
              </span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', wordBreak: 'break-all' }}>{user?.email}</p>
              <div className="d-flex flex-column gap-2 mt-3">
                <Link to="/my-bookings" className="btn-darshan" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                  <i className="bi bi-ticket-perforated me-2"></i>My Bookings
                </Link>
                <Link to="/donate" className="btn-outline-darshan" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                  <i className="bi bi-heart me-2"></i>Donate
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="d-flex gap-2 mb-4">
              <button className={activeTab === 'info' ? 'btn-darshan' : 'btn-outline-darshan'} style={{ fontSize: '0.88rem', padding: '0.55rem 1.25rem' }} onClick={() => setActiveTab('info')}>
                <i className="bi bi-person me-2"></i>Profile Info
              </button>
              <button className={activeTab === 'password' ? 'btn-darshan' : 'btn-outline-darshan'} style={{ fontSize: '0.88rem', padding: '0.55rem 1.25rem' }} onClick={() => setActiveTab('password')}>
                <i className="bi bi-shield-lock me-2"></i>Change Password
              </button>
            </div>

            {activeTab === 'info' && (
              <form onSubmit={handleUpdateProfile} style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }} className="fade-in">
                <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-darshan">Full Name</label>
                    <input type="text" id="profile-name" className="form-control-darshan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Phone Number</label>
                    <input type="tel" id="profile-phone" className="form-control-darshan" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile" />
                  </div>
                  <div className="col-12">
                    <label className="form-label-darshan">Email Address (read-only)</label>
                    <input type="email" className="form-control-darshan" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label-darshan">Role</label>
                    <input type="text" className="form-control-darshan" value={user?.role || ''} disabled style={{ opacity: 0.6 }} />
                  </div>
                  <div className="col-12">
                    <button type="submit" id="save-profile-btn" className="btn-darshan" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }} className="fade-in">
                <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Change Password</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label-darshan">Current Password</label>
                    <input type="password" id="current-password" className="form-control-darshan" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">New Password</label>
                    <input type="password" id="new-password" className="form-control-darshan" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-darshan">Confirm New Password</label>
                    <input type="password" id="confirm-new-password" className="form-control-darshan" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" id="change-password-btn" className="btn-darshan" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Changing...</> : <><i className="bi bi-shield-check me-2"></i>Change Password</>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
