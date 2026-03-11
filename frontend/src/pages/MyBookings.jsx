import { useState, useEffect } from 'react';
import { bookingAPI } from '../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMy();
      setBookings(res.data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled successfully');
      setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'CANCELLED' } : bk));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="section-tag">Dashboard</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>My Darshan Bookings</h1>
          <p>Manage all your temple visit bookings</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {['ALL', 'CONFIRMED', 'CANCELLED'].map(f => (
            <button key={f} id={`filter-${f.toLowerCase()}`}
              className={filter === f ? 'btn-darshan' : 'btn-outline-darshan'}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              onClick={() => setFilter(f)}>
              {f === 'ALL' ? `All (${bookings.length})` : `${f.charAt(0) + f.slice(1).toLowerCase()} (${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner-darshan"></div>
            <p className="loading-text">Loading your bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state-icon">🎫</div>
            <h4 style={{ color: '#444' }}>No bookings found</h4>
            <p className="empty-state-text">
              {filter === 'ALL' ? "You haven't booked any darshan yet." : `No ${filter.toLowerCase()} bookings.`}
            </p>
            <Link to="/temples" className="btn-darshan">Book a Darshan</Link>
          </div>
        ) : (
          <div className="row g-4 fade-in">
            {filtered.map(booking => (
              <div key={booking._id} className="col-md-6 col-xl-4">
                <div className="booking-card">
                  <div className="booking-card-header">
                    <span className="booking-ref">{booking.bookingReference}</span>
                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <h6 style={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>
                      {booking.temple?.name}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: '#555' }}>
                        <i className="bi bi-geo-alt-fill" style={{ color: 'var(--primary)' }}></i>
                        {booking.temple?.location?.city}, {booking.temple?.location?.state}
                      </div>
                      {booking.slot && (
                        <>
                          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: '#555' }}>
                            <i className="bi bi-calendar-event" style={{ color: 'var(--primary)' }}></i>
                            {formatDate(booking.slot.date)}
                          </div>
                          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: '#555' }}>
                            <i className="bi bi-clock" style={{ color: 'var(--primary)' }}></i>
                            {booking.slot.startTime} – {booking.slot.endTime}
                          </div>
                          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: '#555' }}>
                            <i className="bi bi-star" style={{ color: 'var(--primary)' }}></i>
                            {booking.slot.poojaType}
                          </div>
                        </>
                      )}
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: '#555' }}>
                        <i className="bi bi-ticket" style={{ color: 'var(--primary)' }}></i>
                        {booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Paid</div>
                        <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>₹{booking.totalAmount}</div>
                      </div>
                      {booking.status === 'CONFIRMED' && (
                        <button id={`cancel-booking-${booking._id}`} className="btn-outline-darshan" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', borderColor: '#dc3545', color: '#dc3545' }}
                          onClick={() => handleCancel(booking._id)}>
                          <i className="bi bi-x-circle me-1"></i>Cancel
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                      Booked on {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
