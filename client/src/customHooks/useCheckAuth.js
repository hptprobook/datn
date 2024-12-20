import { useState, useEffect, useCallback } from 'react';
import { logoutAPI } from '~/APIs';
import { useSwalWithConfirm } from './useSwal';

export default function useCheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    useSwalWithConfirm
      .fire({
        title: 'Bạn có chắc chắn muốn đăng xuất?',
        text: 'Hành động này sẽ đăng xuất bạn khỏi hệ thống.',
        icon: 'warning',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy',
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          logoutAPI();
          window.location.href = '/';
        }
      });
  }, [setIsAuthenticated, logoutAPI]);

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
