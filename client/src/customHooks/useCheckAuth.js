import { useState, useEffect, useCallback } from 'react';
import { logoutAPI } from '~/APIs';

export default function useCheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.reload();
    logoutAPI();
  }, []);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
