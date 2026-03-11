import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminAPI, templeAPI, slotAPI, bookingAPI } from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/admin/temples', label: 'Temples', icon: 'bi-building' },
  { path: '/admin/slots', label: 'Darshan Slots', icon: 'bi-calendar3' },
  { path: '/admin/bookings', label: 'Bookings', icon: 'bi-ticket-perforated' },
  { path: '/admin/users', label: 'Users', icon: 'bi-people' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-title">Main Menu</div>
      {sidebarLinks.map(l => (
        <Link key={l.path} to={l.path} id={`admin-nav-${l.label.toLowerCase().replace(' ', '-')}`}
          className={`admin-nav-item ${location.pathname === l.path ? 'active' : ''}`}>
          <i className={`bi ${l.icon}`}></i>{l.label}
        </Link>
      ))}
      <div className="admin-sidebar-title mt-3">Account</div>
      <button className="admin-nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: 'rgba(255,100,100,0.8)' }} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>Logout
      </button>
    </div>
  );
};

// Dashboard Stats Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-wrapper"><div className="spinner-darshan"></div></div>;

  const statCards = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: 'bi-people-fill', color: '#4e73df', bg: '#4e73df22' },
    { label: 'Active Temples', value: stats?.stats?.totalTemples || 0, icon: 'bi-building-fill', color: '#c8773a', bg: '#c8773a22' },
    { label: 'Total Bookings', value: stats?.stats?.totalBookings || 0, icon: 'bi-ticket-perforated-fill', color: '#1cc88a', bg: '#1cc88a22' },
    { label: 'Total Donations', value: `₹${(stats?.stats?.totalDonations || 0).toLocaleString()}`, icon: 'bi-heart-fill', color: '#e74a3b', bg: '#e74a3b22' },
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>Welcome back! Here's what's happening.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem' }}>Recent Bookings</h5>
        {stats?.recentBookings?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No bookings yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="darshan-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Temple</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map(b => (
                  <tr key={b._id}>
                    <td><code style={{ color: 'var(--primary)' }}>{b.bookingReference}</code></td>
                    <td>{b.user?.name}</td>
                    <td>{b.temple?.name}</td>
                    <td><span className={`status-badge status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Manage Temples
const ManageTemples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', 'location.city': '', 'location.state': '', 'location.address': '', deity: '', 'timings.openTime': '06:00', 'timings.closeTime': '20:00', facilities: '' });

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const res = await templeAPI.getAll({ limit: 50 });
      setTemples(res.data.temples);
    } catch { toast.error('Failed to load temples'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name,
        description: form.description,
        deity: form.deity,
        location: { city: form['location.city'], state: form['location.state'], address: form['location.address'] },
        timings: { openTime: form['timings.openTime'], closeTime: form['timings.closeTime'] },
        facilities: form.facilities ? form.facilities.split(',').map(f => f.trim()) : []
      };
      await templeAPI.create(data);
      toast.success('Temple created successfully!');
      setShowForm(false);
      fetchTemples();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create temple'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this temple?')) return;
    try {
      await templeAPI.delete(id);
      toast.success('Temple deactivated');
      fetchTemples();
    } catch { toast.error('Failed to deactivate temple'); }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 style={{ fontFamily: 'Playfair Display, serif' }}>Manage Temples</h3>
        <button id="add-temple-btn" className="btn-darshan" onClick={() => setShowForm(!showForm)}>
          <i className={`bi bi-${showForm ? 'x' : 'plus-lg'} me-2`}></i>
          {showForm ? 'Cancel' : 'Add Temple'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} id="create-temple-form" style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <h5 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Create New Temple</h5>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label-darshan">Temple Name *</label><input required className="form-control-darshan" placeholder="Temple name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="col-md-6"><label className="form-label-darshan">Deity</label><input className="form-control-darshan" placeholder="Main deity" value={form.deity} onChange={e => setForm(f => ({ ...f, deity: e.target.value }))} /></div>
            <div className="col-md-4"><label className="form-label-darshan">City *</label><input required className="form-control-darshan" placeholder="City" value={form['location.city']} onChange={e => setForm(f => ({ ...f, 'location.city': e.target.value }))} /></div>
            <div className="col-md-4"><label className="form-label-darshan">State *</label><input required className="form-control-darshan" placeholder="State" value={form['location.state']} onChange={e => setForm(f => ({ ...f, 'location.state': e.target.value }))} /></div>
            <div className="col-md-4"><label className="form-label-darshan">Address</label><input className="form-control-darshan" placeholder="Full address" value={form['location.address']} onChange={e => setForm(f => ({ ...f, 'location.address': e.target.value }))} /></div>
            <div className="col-md-6"><label className="form-label-darshan">Open Time</label><input type="time" className="form-control-darshan" value={form['timings.openTime']} onChange={e => setForm(f => ({ ...f, 'timings.openTime': e.target.value }))} /></div>
            <div className="col-md-6"><label className="form-label-darshan">Close Time</label><input type="time" className="form-control-darshan" value={form['timings.closeTime']} onChange={e => setForm(f => ({ ...f, 'timings.closeTime': e.target.value }))} /></div>
            <div className="col-12"><label className="form-label-darshan">Facilities (comma separated)</label><input className="form-control-darshan" placeholder="Parking, Food, Prasadam, Accommodation" value={form.facilities} onChange={e => setForm(f => ({ ...f, facilities: e.target.value }))} /></div>
            <div className="col-12"><label className="form-label-darshan">Description *</label><textarea required className="form-control-darshan" rows={3} placeholder="Temple description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'none' }} /></div>
            <div className="col-12"><button type="submit" id="submit-temple-btn" className="btn-darshan"><i className="bi bi-check2 me-2"></i>Create Temple</button></div>
          </div>
        </form>
      )}

      {loading ? <div className="loading-wrapper"><div className="spinner-darshan"></div></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="darshan-table">
            <thead>
              <tr><th>Name</th><th>Location</th><th>Deity</th><th>Timings</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {temples.map(t => (
                <tr key={t._id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.location?.city}, {t.location?.state}</td>
                  <td>{t.deity || '—'}</td>
                  <td>{t.timings?.openTime} – {t.timings?.closeTime}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/temples/${t._id}`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: '8px', fontSize: '0.8rem' }}>View</Link>
                      <button className="btn btn-sm btn-outline-danger" id={`delete-temple-${t._id}`} style={{ borderRadius: '8px', fontSize: '0.8rem' }} onClick={() => handleDelete(t._id)}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Manage Slots
const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ temple: '', date: '', startTime: '06:00', endTime: '08:00', poojaType: 'General Darshan', capacity: 100, pricePerTicket: 0 });

  useEffect(() => {
    Promise.all([slotAPI.getAll(), templeAPI.getAll({ limit: 50 })]).then(([s, t]) => {
      setSlots(s.data.slots);
      setTemples(t.data.temples);
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await slotAPI.create(form);
      toast.success('Slot created!');
      setShowForm(false);
      const res = await slotAPI.getAll();
      setSlots(res.data.slots);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create slot'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try { await slotAPI.delete(id); toast.success('Slot removed'); setSlots(s => s.filter(sl => sl._id !== id)); }
    catch { toast.error('Failed to delete slot'); }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 style={{ fontFamily: 'Playfair Display, serif' }}>Manage Darshan Slots</h3>
        <button id="add-slot-btn" className="btn-darshan" onClick={() => setShowForm(!showForm)}>
          <i className={`bi bi-${showForm ? 'x' : 'plus-lg'} me-2`}></i>{showForm ? 'Cancel' : 'Add Slot'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} id="create-slot-form" style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <h5 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Create Darshan Slot</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-darshan">Temple *</label>
              <select required className="form-control-darshan" value={form.temple} onChange={e => setForm(f => ({ ...f, temple: e.target.value }))}>
                <option value="">-- Select Temple --</option>
                {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="col-md-6"><label className="form-label-darshan">Date *</label><input required type="date" className="form-control-darshan" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().slice(0, 10)} /></div>
            <div className="col-md-3"><label className="form-label-darshan">Start Time</label><input type="time" className="form-control-darshan" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
            <div className="col-md-3"><label className="form-label-darshan">End Time</label><input type="time" className="form-control-darshan" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
            <div className="col-md-3"><label className="form-label-darshan">Capacity</label><input type="number" className="form-control-darshan" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} min="1" /></div>
            <div className="col-md-3"><label className="form-label-darshan">Price (₹)</label><input type="number" className="form-control-darshan" value={form.pricePerTicket} onChange={e => setForm(f => ({ ...f, pricePerTicket: e.target.value }))} min="0" /></div>
            <div className="col-md-6">
              <label className="form-label-darshan">Pooja Type</label>
              <select className="form-control-darshan" value={form.poojaType} onChange={e => setForm(f => ({ ...f, poojaType: e.target.value }))}>
                {['General Darshan', 'Special Darshan', 'VIP Darshan', 'Abhishek', 'Aarti', 'Prasadam'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-12"><button type="submit" id="submit-slot-btn" className="btn-darshan"><i className="bi bi-check2 me-2"></i>Create Slot</button></div>
          </div>
        </form>
      )}

      {loading ? <div className="loading-wrapper"><div className="spinner-darshan"></div></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="darshan-table">
            <thead>
              <tr><th>Temple</th><th>Date</th><th>Time</th><th>Type</th><th>Seats</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s._id}>
                  <td>{s.temple?.name}</td>
                  <td>{new Date(s.date).toLocaleDateString('en-IN')}</td>
                  <td>{s.startTime} – {s.endTime}</td>
                  <td>{s.poojaType}</td>
                  <td>{s.availableSeats}/{s.capacity}</td>
                  <td>₹{s.pricePerTicket}</td>
                  <td><button id={`delete-slot-${s._id}`} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '8px', fontSize: '0.8rem' }} onClick={() => handleDelete(s._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Manage Bookings
const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getAll({ limit: 50 }).then(r => setBookings(r.data.bookings)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Manage Bookings</h3>
      {loading ? <div className="loading-wrapper"><div className="spinner-darshan"></div></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="darshan-table">
            <thead>
              <tr><th>Reference</th><th>User</th><th>Temple</th><th>Tickets</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td><code style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>{b.bookingReference}</code></td>
                  <td>{b.user?.name}<br /><small style={{ color: 'var(--text-muted)' }}>{b.user?.email}</small></td>
                  <td>{b.temple?.name}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>₹{b.totalAmount}</td>
                  <td><span className={`status-badge status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  <td>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Manage Users
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers({ limit: 50 }).then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await adminAPI.updateUser(userId, { role });
      toast.success('User role updated');
      setUsers(u => u.map(user => user._id === userId ? { ...user, role } : user));
    } catch { toast.error('Failed to update user'); }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
      setUsers(u => u.map(user => user._id === userId ? { ...user, isActive: !isActive } : user));
    } catch { toast.error('Failed to update user status'); }
  };

  return (
    <div className="fade-in">
      <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Manage Users</h3>
      {loading ? <div className="loading-wrapper"><div className="spinner-darshan"></div></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="darshan-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <select value={u.role} id={`role-${u._id}`} className="form-control-darshan" style={{ padding: '0.25rem 0.5rem', fontSize: '0.82rem' }}
                      onChange={e => handleRoleChange(u._id, e.target.value)}>
                      <option>USER</option>
                      <option>ORGANIZER</option>
                      <option>ADMIN</option>
                    </select>
                  </td>
                  <td><span className={`status-badge ${u.isActive ? 'status-confirmed' : 'status-cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button id={`toggle-user-${u._id}`} className={`btn btn-sm ${u.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      style={{ borderRadius: '8px', fontSize: '0.8rem' }} onClick={() => handleToggleStatus(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Admin Layout Wrapper
const Admin = ({ activeView = 'dashboard' }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'temples' && <ManageTemples />}
        {activeView === 'slots' && <ManageSlots />}
        {activeView === 'bookings' && <ManageBookings />}
        {activeView === 'users' && <ManageUsers />}
      </div>
    </div>
  );
};

export { Admin, ManageTemples, ManageSlots, ManageBookings, ManageUsers };
export default Admin;
