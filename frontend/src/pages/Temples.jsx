import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templeAPI } from '../api/axios';
import { toast } from 'react-toastify';

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTemples = async (searchVal = '', currentPage = 1) => {
    setLoading(true);
    try {
      const res = await templeAPI.getAll({ search: searchVal, page: currentPage, limit: 9 });
      setTemples(res.data.temples);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load temples');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemples(search, page); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTemples(search, 1);
  };

  const emojiMap = { 'General Darshan': '🙏', 'North India': '⛰️', 'South India': '🌺', default: '🛕' };

  return (
    <div>
      <div className="page-header">
        <div className="container text-center" style={{ paddingBottom: '2rem' }}>
          <div className="section-tag">Explore</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', marginTop: '0.75rem' }}>Sacred Temples of India</h1>
          <p className="mt-2">Discover and book darshan at India's most revered sacred sites</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-5" id="temple-search-form">
          <div className="d-flex gap-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="flex-grow-1 position-relative">
              <input
                type="text"
                id="temple-search"
                className="form-control-darshan"
                placeholder="Search by temple name, deity, or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem', borderRadius: '50px' }}
              />
              <i className="bi bi-search position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
            </div>
            <button type="submit" id="temple-search-btn" className="btn-darshan" style={{ borderRadius: '50px', padding: '0.65rem 1.5rem' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner-darshan"></div>
            <p className="loading-text">Loading temples...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state-icon">🛕</div>
            <h4 style={{ color: '#444' }}>No temples found</h4>
            <p className="empty-state-text">Try a different search term</p>
            <button className="btn-darshan" onClick={() => { setSearch(''); fetchTemples('', 1); }}>
              View All Temples
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4 fade-in">
              {temples.map(temple => (
                <div key={temple._id} className="col-md-6 col-lg-4">
                  <div className="temple-card">
                    {temple.images?.length > 0 ? (
                      <img src={temple.images[0]} alt={temple.name} className="temple-card-img" />
                    ) : (
                      <div className="temple-card-img-placeholder">🛕</div>
                    )}
                    <div className="temple-card-body">
                      <h5 className="temple-card-title">{temple.name}</h5>
                      <p className="temple-card-location">
                        <i className="bi bi-geo-alt-fill" style={{ color: 'var(--primary)' }}></i>
                        {temple.location?.city}, {temple.location?.state}
                      </p>
                      {temple.deity && <span className="temple-card-badge">{temple.deity}</span>}
                      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {temple.description}
                      </p>
                      <div className="d-flex gap-2 mt-3">
                        <Link to={`/temples/${temple._id}`} className="btn-darshan" id={`temple-view-${temple._id}`} style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', flex: 1, justifyContent: 'center' }}>
                          <i className="bi bi-info-circle me-1"></i>Details
                        </Link>
                        <Link to={`/temples/${temple._id}/book`} className="btn-gold" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', flex: 1, justifyContent: 'center', color: '#1a1025' }}>
                          <i className="bi bi-ticket me-1"></i>Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-5">
                <button
                  className="btn-outline-darshan"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? 'btn-darshan' : 'btn-outline-darshan'}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minWidth: '42px' }}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn-outline-darshan"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Temples;
