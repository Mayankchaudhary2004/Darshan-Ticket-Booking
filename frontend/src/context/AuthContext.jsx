import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('darshanToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/api/auth/me');
          setUser(res.data.user);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('darshanToken', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('darshanToken', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('darshanToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isOrganizer = () => user?.role === 'ORGANIZER';
  const isUser = () => user?.role === 'USER';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isOrganizer, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
