// src/hooks/useAuth.jsx

import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useContext, useCallback, createContext } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useMemo(() => {
    const tokenLocal = localStorage.getItem('token');
    if (tokenLocal) {
      setToken(tokenLocal);
    }
  }, []);

  const navigate = useNavigate();

  const login = useCallback(async (data) => {
    localStorage.setItem('token', data);
    navigate('/', { replace: true });
    setToken(data);
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = `login`;
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
