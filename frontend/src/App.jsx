import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Temples from './pages/Temples';
import TempleDetail from './pages/TempleDetail';
import BookSlot from './pages/BookSlot';
import MyBookings from './pages/MyBookings';
import Donate from './pages/Donate';
import Profile from './pages/Profile';
import Admin, { ManageTemples, ManageSlots, ManageBookings, ManageUsers } from './pages/Admin';

const AdminLayout = ({ view }) => (
  <ProtectedRoute roles={['ADMIN']}>
    <Admin activeView={view} />
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/temples" element={<Temples />} />
              <Route path="/temples/:id" element={<TempleDetail />} />

              {/* Authenticated User Routes */}
              <Route path="/temples/:id/book" element={
                <ProtectedRoute roles={['USER', 'ADMIN', 'ORGANIZER']}>
                  <BookSlot />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/donate" element={
                <ProtectedRoute>
                  <Donate />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout view="dashboard" />} />
              <Route path="/admin/temples" element={<AdminLayout view="temples" />} />
              <Route path="/admin/slots" element={<AdminLayout view="slots" />} />
              <Route path="/admin/bookings" element={<AdminLayout view="bookings" />} />
              <Route path="/admin/users" element={<AdminLayout view="users" />} />

              {/* 404 Fallback */}
              <Route path="*" element={
                <div className="container py-5 text-center fade-in" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '6rem' }}>🛕</div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', marginTop: '1rem' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-darshan" style={{ textDecoration: 'none' }}>
                    <i className="bi bi-house me-2"></i>Go Home
                  </a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{ borderRadius: '12px', fontFamily: 'Poppins, sans-serif' }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
