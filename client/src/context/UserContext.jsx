/* eslint-disable */

import { useQuery } from '@tanstack/react-query';
import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import useCheckAuth from '~/customHooks/useCheckAuth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useCheckAuth();

  const {
    data,
    refetch: refetchUser,
    isLoading,
  } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  });

  const setUserInfo = (userInfo) => {
    setUser(userInfo);
  };

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data, setUserInfo]);

  if (isLoading) {
    return <MainLoading />;
  }

  const value = {
    user,
    refetchUser,
    setUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
