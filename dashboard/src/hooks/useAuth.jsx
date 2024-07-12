// src/hooks/useAuth.jsx

import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useContext, useCallback, createContext } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useMemo(() => {
    const userLocal = localStorage.getItem('user');
    if (userLocal) {
      setUser(JSON.parse(userLocal));
    }
  }, []);

  const navigate = useNavigate();

  const login = useCallback(async (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/', { replace: true });
    setUser(data);
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
