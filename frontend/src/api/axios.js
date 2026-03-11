import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add stored token to all requests
const token = localStorage.getItem('darshanToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('darshanToken');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default api;

// ===== API Functions =====

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

// Temples
export const templeAPI = {
  getAll: (params) => api.get('/api/temples', { params }),
  getOne: (id) => api.get(`/api/temples/${id}`),
  create: (data) => api.post('/api/temples', data),
  update: (id, data) => api.put(`/api/temples/${id}`, data),
  delete: (id) => api.delete(`/api/temples/${id}`),
};

// Darshan Slots
export const slotAPI = {
  getByTemple: (templeId, params) => api.get(`/api/slots/temple/${templeId}`, { params }),
  getAll: () => api.get('/api/slots'),
  getOne: (id) => api.get(`/api/slots/${id}`),
  create: (data) => api.post('/api/slots', data),
  update: (id, data) => api.put(`/api/slots/${id}`, data),
  delete: (id) => api.delete(`/api/slots/${id}`),
};

// Bookings
export const bookingAPI = {
  create: (data) => api.post('/api/bookings', data),
  getMy: () => api.get('/api/bookings/my'),
  getAll: (params) => api.get('/api/bookings', { params }),
  getOne: (id) => api.get(`/api/bookings/${id}`),
  cancel: (id) => api.put(`/api/bookings/${id}/cancel`),
};

// Donations
export const donationAPI = {
  create: (data) => api.post('/api/donations', data),
  getMy: () => api.get('/api/donations/my'),
  getAll: (params) => api.get('/api/donations', { params }),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
};
