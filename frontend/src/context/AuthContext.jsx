import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('AuthContext - Token found, verifying...');
      // Verify token and get user data
      axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('AuthContext - Token verified, user data:', response.data.user);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error('AuthContext - Token verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      console.log('AuthContext - No token found');
      setLoading(false);
    }
  }, []);

  const login = async (email, password, userType) => {
    try {
      console.log('AuthContext - Attempting login with:', { email, password, userType });
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        userType
      });
      console.log('AuthContext - Login response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('AuthContext - Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext - Registration data:', userData);
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      console.log('AuthContext - Registration response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return response.data;
    } catch (error) {
      console.error('AuthContext - Registration error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 