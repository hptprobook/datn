import { useState, useEffect, useCallback } from 'react';

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
