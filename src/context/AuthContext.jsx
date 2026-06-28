import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, registerStudent } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
      storedUser = null;
    }

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await loginApi(identifier, password);
      const data = res.data;

      const userData = {
        id:    data.id,
        name:  data.name,
        role:  data.role?.toLowerCase() || 'student',
        email: data.email || '',
        registration_number: data.registration_number || '',
        teacher_id: data.teacher_id || '',
        department: data.department || '',
        semester: data.semester || '',
        subject: data.subject || '',
        class_name: data.class_name || '',
      };

      const accessToken = data.token || data.access_token;

      if (!accessToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const signup = async (email, password, name) => {
    try {
      const res = await registerStudent({ email, password, name, role: 'student' });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
