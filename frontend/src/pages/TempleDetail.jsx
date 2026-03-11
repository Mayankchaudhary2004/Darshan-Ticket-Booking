import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { templeAPI, slotAPI } from '../api/axios';
import { toast } from 'react-toastify';

const TempleDetail = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templeRes, slotsRes] = await Promise.all([
          templeAPI.getOne(id),
          slotAPI.getByTemple(id, { date: selectedDate })
        ]);
        setTemple(templeRes.data.temple);
        setSlots(slotsRes.data.slots);
      } catch {
        toast.error('Failed to load temple details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, selectedDate]);

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner-darshan"></div>
      <p className="loading-text">Loading temple details...</p>
    </div>
  );

  if (!temple) return (
    <div className="container py-5 text-center">
      <h3>Temple not found</h3>
      <Link to="/temples" className="btn-darshan mt-3">Back to Temples</Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <nav className="mb-3">
            <Link to="/temples" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.87rem' }}>
              <i className="bi bi-chevron-left me-1"></i>All Temples
            </Link>
          </nav>
          <div className="row align-items-end g-4" style={{ position: 'relative', zIndex: 2 }}>
            <div className="col-lg-8">
              <div className="section-tag">{temple.location?.city}, {temple.location?.state}</div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>{temple.name}</h1>
              {temple.deity && (
                <p className="mt-2">
                  <i className="bi bi-star-fill me-2" style={{ color: 'var(--accent)' }}></i>
                  Deity: <strong>{temple.deity}</strong>
                </p>
              )}
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to={`/temples/${id}/book`} className="btn-gold" id="book-darshan-btn" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                <i className="bi bi-ticket-perforated me-2"></i>Book Darshan
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* About */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>About This Temple</h4>
              <p style={{ color: '#555', lineHeight: '1.9', marginBottom: 0 }}>{temple.description}</p>
            </div>

            {/* Facilities */}
            {temple.facilities?.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Facilities</h4>
                <div className="d-flex flex-wrap gap-2">
                  {temple.facilities.map((f, i) => (
                    <span key={i} style={{ background: 'rgba(200,119,58,0.1)', color: 'var(--primary)', padding: '0.35rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 500 }}>
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Slots by Date */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 0 }}>Available Darshan Slots</h4>
                <input
                  type="date"
                  id="slot-date-filter"
                  className="form-control-darshan"
                  style={{ width: 'auto' }}
                  value={selectedDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              {slots.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon">📅</div>
                  <p className="empty-state-text">No slots available for selected date</p>
                  <Link to={`/temples/${id}/book`} className="btn-darshan">Book Any Available Slot</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {slots.map(slot => (
                    <div key={slot._id} className="slot-card">
                      <div>
                        <div className="slot-time">{slot.startTime} – {slot.endTime}</div>
                        <div className="slot-type">{slot.poojaType}</div>
                      </div>
                      <div className="text-center">
                        <div className="slot-seats">
                          <i className="bi bi-people me-1"></i>
                          {slot.availableSeats} seats left
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>of {slot.capacity}</div>
                      </div>
                      <div className="text-end">
                        <div className="slot-price">₹{slot.pricePerTicket}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per ticket</div>
                      </div>
                      <Link to={`/temples/${id}/book?slotId=${slot._id}`} className="btn-darshan" id={`slot-book-${slot._id}`} style={{ fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}>
                        Book
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', position: 'sticky', top: '90px' }}>
              <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem' }}>Temple Info</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-geo-alt-fill mt-1" style={{ color: 'var(--primary)', fontSize: '1rem' }}></i>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Location</div>
                    <div style={{ color: '#666', fontSize: '0.85rem' }}>
                      {temple.location?.address && <>{temple.location.address}<br /></>}
                      {temple.location?.city}, {temple.location?.state}
                      {temple.location?.pincode && ` - ${temple.location.pincode}`}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-clock-fill mt-1" style={{ color: 'var(--primary)', fontSize: '1rem' }}></i>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Timings</div>
                    <div style={{ color: '#666', fontSize: '0.85rem' }}>{temple.timings?.openTime} – {temple.timings?.closeTime}</div>
                  </div>
                </div>
                {temple.totalBookings > 0 && (
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-people-fill mt-1" style={{ color: 'var(--primary)', fontSize: '1rem' }}></i>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Total Bookings</div>
                      <div style={{ color: '#666', fontSize: '0.85rem' }}>{temple.totalBookings.toLocaleString()} devotees</div>
                    </div>
                  </div>
                )}
              </div>
              <Link to={`/temples/${id}/book`} className="btn-darshan w-100 mt-4" style={{ justifyContent: 'center', padding: '0.8rem' }}>
                <i className="bi bi-ticket-perforated me-2"></i>Book Darshan Now
              </Link>
              <Link to="/donate" className="btn-outline-darshan w-100 mt-2" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.88rem' }}>
                <i className="bi bi-heart me-2"></i>Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
