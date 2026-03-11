import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { templeAPI, slotAPI, bookingAPI } from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const BookSlot = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preSelectedSlot = searchParams.get('slotId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [templeRes, slotsRes] = await Promise.all([
          templeAPI.getOne(id),
          slotAPI.getByTemple(id, { date: selectedDate })
        ]);
        setTemple(templeRes.data.temple);
        setSlots(slotsRes.data.slots);
        if (preSelectedSlot) {
          const found = slotsRes.data.slots.find(s => s._id === preSelectedSlot);
          if (found) setSelectedSlot(found);
        }
      } catch {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, selectedDate]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    try {
      const res = await slotAPI.getByTemple(id, { date });
      setSlots(res.data.slots);
    } catch {}
  };

  const handleBook = async () => {
    if (!selectedSlot) { toast.error('Please select a darshan slot'); return; }
    if (tickets < 1) { toast.error('At least 1 ticket required'); return; }
    if (tickets > selectedSlot.availableSeats) { toast.error(`Only ${selectedSlot.availableSeats} seats available`); return; }

    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        slotId: selectedSlot._id,
        numberOfTickets: tickets,
        specialRequests
      });
      toast.success(`🎉 Booking Confirmed! Ref: ${res.data.booking.bookingReference}`);
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const total = selectedSlot ? selectedSlot.pricePerTicket * tickets : 0;

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner-darshan"></div>
      <p className="loading-text">Loading booking details...</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="section-tag">Book Darshan</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>{temple?.name}</h1>
          <p className="mt-1"><i className="bi bi-geo-alt me-2"></i>{temple?.location?.city}, {temple?.location?.state}</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Slot Selection */}
          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem' }}>
                <i className="bi bi-calendar-date me-2" style={{ color: 'var(--primary)' }}></i>
                Select Date & Slot
              </h5>
              <div className="mb-3">
                <label className="form-label-darshan">Visit Date</label>
                <input id="book-date" type="date" className="form-control-darshan" value={selectedDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => handleDateChange(e.target.value)} />
              </div>

              {slots.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon">📅</div>
                  <p className="empty-state-text">No slots available for this date</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3" id="slot-list">
                  {slots.map(slot => (
                    <div
                      key={slot._id}
                      id={`slot-${slot._id}`}
                      className={`slot-card ${selectedSlot?._id === slot._id ? 'selected' : ''} ${slot.availableSeats === 0 ? 'opacity-50' : ''}`}
                      onClick={() => slot.availableSeats > 0 && setSelectedSlot(slot)}
                      style={{ cursor: slot.availableSeats === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      <div>
                        <div className="slot-time">{slot.startTime} – {slot.endTime}</div>
                        <div className="slot-type">{slot.poojaType}</div>
                      </div>
                      <div className="text-center">
                        <div className={`slot-seats ${slot.availableSeats === 0 ? 'text-danger' : ''}`}>
                          {slot.availableSeats === 0 ? 'Full' : `${slot.availableSeats} left`}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="slot-price">₹{slot.pricePerTicket}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per ticket</div>
                      </div>
                      {selectedSlot?._id === slot._id && (
                        <i className="bi bi-check-circle-fill" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}></i>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Count */}
            {selectedSlot && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem' }}>
                  <i className="bi bi-ticket-perforated me-2" style={{ color: 'var(--primary)' }}></i>
                  Number of Tickets
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <button className="btn-outline-darshan" id="decrement-tickets" style={{ padding: '0.5rem 1rem', borderRadius: '10px' }}
                    onClick={() => tickets > 1 && setTickets(t => t - 1)}>
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{tickets}</span>
                  <button className="btn-outline-darshan" id="increment-tickets" style={{ padding: '0.5rem 1rem', borderRadius: '10px' }}
                    onClick={() => tickets < Math.min(10, selectedSlot.availableSeats) && setTickets(t => t + 1)}>
                    <i className="bi bi-plus-lg"></i>
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Max: {Math.min(10, selectedSlot.availableSeats)}</span>
                </div>
              </div>
            )}

            {/* Special Requests */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem' }}>
                Special Requests (Optional)
              </h5>
              <textarea id="special-requests" className="form-control-darshan" placeholder="Any special requirements or requests..."
                rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'sticky', top: '90px' }}>
              <h5 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Booking Summary</h5>

              <div className="d-flex flex-column gap-3 mb-3">
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Temple</span>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{temple?.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Date</span>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {selectedSlot ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Time Slot</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{selectedSlot.startTime} – {selectedSlot.endTime}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Pooja Type</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{selectedSlot.poojaType}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Price per Ticket</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>₹{selectedSlot.pricePerTicket}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Tickets</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>× {tickets}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0', fontSize: '0.9rem' }}>
                    Select a darshan slot to see pricing
                  </div>
                )}
              </div>

              {selectedSlot && (
                <>
                  <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Amount</span>
                      <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>₹{total}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(200,119,58,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                      <i className="bi bi-person me-1"></i>
                      Booking for: <strong>{user?.name}</strong>
                    </p>
                  </div>
                </>
              )}

              <button
                id="confirm-booking-btn"
                className="btn-darshan w-100"
                style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
                onClick={handleBook}
                disabled={!selectedSlot || submitting}
              >
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</>
                ) : (
                  <><i className="bi bi-check2-circle me-2"></i>Confirm Booking {selectedSlot ? `• ₹${total}` : ''}</>
                )}
              </button>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                <i className="bi bi-shield-check me-1"></i>Secure booking with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
