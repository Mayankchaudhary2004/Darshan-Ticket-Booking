import { useState, useEffect } from 'react';
import { templeAPI, donationAPI } from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AMOUNTS = [100, 251, 501, 1001, 2501, 5001];
const PURPOSES = ['General', 'Temple Maintenance', 'Festivals', 'Charity', 'Food Prasadam', 'Education'];

const Donate = () => {
  const { user } = useAuth();
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState({ templeId: '', amount: 501, customAmount: '', purpose: 'General', message: '', isAnonymous: false });
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('donate');

  useEffect(() => {
    templeAPI.getAll({ limit: 50 }).then(r => setTemples(r.data.temples));
    donationAPI.getMy().then(r => setMyDonations(r.data.donations));
  }, []);

  const finalAmount = form.customAmount ? parseInt(form.customAmount) : form.amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.templeId) { toast.error('Please select a temple'); return; }
    if (!finalAmount || finalAmount < 1) { toast.error('Please enter a valid amount'); return; }

    setLoading(true);
    try {
      await donationAPI.create({ templeId: form.templeId, amount: finalAmount, purpose: form.purpose, message: form.message, isAnonymous: form.isAnonymous });
      toast.success('🙏 Thank you for your generous donation! May Lord bless you!');
      const res = await donationAPI.getMy();
      setMyDonations(res.data.donations);
      setForm(f => ({ ...f, customAmount: '', message: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="section-tag">Seva & Donations</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>Make a Donation 🙏</h1>
          <p>Contribute to temple operations, festivals, and charitable causes</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Tabs */}
        <div className="d-flex gap-2 mb-4">
          <button className={activeTab === 'donate' ? 'btn-darshan' : 'btn-outline-darshan'} id="tab-donate"
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }} onClick={() => setActiveTab('donate')}>
            <i className="bi bi-heart me-2"></i>Donate
          </button>
          <button className={activeTab === 'history' ? 'btn-darshan' : 'btn-outline-darshan'} id="tab-history"
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }} onClick={() => setActiveTab('history')}>
            <i className="bi bi-clock-history me-2"></i>My Donations ({myDonations.length})
          </button>
        </div>

        {activeTab === 'donate' ? (
          <div className="row g-4 justify-content-center">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }} id="donate-form">
                <div className="mb-4">
                  <label className="form-label-darshan">Select Temple *</label>
                  <select className="form-control-darshan" id="donate-temple" value={form.templeId} onChange={e => setForm(f => ({ ...f, templeId: e.target.value }))} required>
                    <option value="">-- Choose a temple --</option>
                    {temples.map(t => <option key={t._id} value={t._id}>{t.name} — {t.location?.city}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label-darshan">Donation Amount (₹) *</label>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {AMOUNTS.map(a => (
                      <button type="button" key={a} id={`amount-${a}`}
                        className={`donation-amount-btn ${form.amount === a && !form.customAmount ? 'active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, amount: a, customAmount: '' }))}>
                        ₹{a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input type="number" id="custom-amount" className="form-control-darshan" placeholder="Or enter custom amount"
                    value={form.customAmount} onChange={e => setForm(f => ({ ...f, customAmount: e.target.value }))} min="1" />
                </div>

                <div className="mb-4">
                  <label className="form-label-darshan">Purpose</label>
                  <div className="d-flex flex-wrap gap-2">
                    {PURPOSES.map(p => (
                      <button type="button" key={p}
                        className={`donation-amount-btn ${form.purpose === p ? 'active' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setForm(f => ({ ...f, purpose: p }))}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label-darshan">Personal Message (Optional)</label>
                  <textarea className="form-control-darshan" id="donation-message" rows={3} placeholder="Leave a prayer or message..."
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'none' }} />
                </div>

                <div className="mb-4 d-flex align-items-center gap-2">
                  <input type="checkbox" id="anonymous" checked={form.isAnonymous} onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="anonymous" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Make this donation anonymous
                  </label>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(200,119,58,0.1), rgba(255,215,0,0.05))', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(200,119,58,0.2)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontWeight: 600 }}>Donation Amount</span>
                    <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>₹{(finalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" id="donate-submit" className="btn-gold w-100" disabled={loading}
                  style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', borderRadius: '12px' }}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                  ) : (
                    <><i className="bi bi-heart-fill me-2"></i>Donate ₹{(finalAmount || 0).toLocaleString()}</>
                  )}
                </button>
              </form>
            </div>

            <div className="col-lg-4 d-none d-lg-block">
              <div style={{ background: 'var(--gradient-hero)', borderRadius: '20px', padding: '2rem', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
                <h4 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--accent)' }}>Your Generosity Matters</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.8, marginTop: '1rem' }}>
                  Your donation helps maintain sacred temples, support temple staff, fund festivals, and provide food to devotees.
                </p>
                <div className="mt-3 d-flex flex-column gap-2">
                  {['Temple lighting & maintenance', 'Prasadam for devotees', 'Festival celebrations', 'Staff salaries', 'Charity programs'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-check-circle-fill" style={{ color: 'var(--accent)' }}></i>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-3 fade-in">
            {myDonations.length === 0 ? (
              <div className="col-12 empty-state">
                <div className="empty-state-icon">💛</div>
                <h4>No donations yet</h4>
                <p className="empty-state-text">Make your first donation to support temple operations</p>
                <button className="btn-darshan" onClick={() => setActiveTab('donate')}>Make a Donation</button>
              </div>
            ) : (
              myDonations.map(d => (
                <div key={d._id} className="col-md-6">
                  <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{d.temple?.name}</h6>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <span style={{ background: 'rgba(200,119,58,0.1)', color: 'var(--primary)', padding: '0.2rem 0.75rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {d.purpose}
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{d.amount}</div>
                    </div>
                    {d.message && <p style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic', marginTop: '0.75rem', marginBottom: 0 }}>"{d.message}"</p>}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>Ref: {d.transactionId}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
