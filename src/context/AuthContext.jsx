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
      // Backend returns: { success, message, data: { user, token } }
      const payload = res.data?.data || res.data;

      const userObj = payload?.user || payload;
      const accessToken = payload?.token || payload?.access_token || res.data?.token;

      if (!accessToken) {
        throw new Error('No token received from server');
      }

      const userData = {
        id:    userObj._id || userObj.id,
        name:  userObj.name,
        role:  userObj.role?.toLowerCase() || 'student',
        email: userObj.email || '',
        registration_number: userObj.registration_number || '',
        teacher_id: userObj.teacher_id || '',
        department: userObj.department || '',
        semester: userObj.semester || '',
        subject: userObj.subject || '',
        class_name: userObj.class_name || '',
      };

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
