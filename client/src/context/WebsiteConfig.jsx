/* eslint-disable */

import { useQuery } from '@tanstack/react-query';
import { min } from 'date-fns';
import { createContext, useContext, useEffect, useState } from 'react';
import { getMinMaxPrices, getWebsiteConfig } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';

const WebConfigContext = createContext();

export const WebConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const {
    data,
    refetch: webConfigRefetch,
    isLoading,
  } = useQuery({
    queryKey: ['websiteConfig'],
    queryFn: getWebsiteConfig,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });

  const { data: minMaxPrice } = useQuery({
    queryKey: ['minMaxPrice'],
    queryFn: getMinMaxPrices,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (data) {
      setConfig(data);
    }
  }, [data]);

  if (isLoading || !config) {
    return <MainLoading />;
  }

  const value = {
    config,
    minMaxPrice,
    refetchConfig: webConfigRefetch,
  };

  return (
    <WebConfigContext.Provider value={value}>
      {children}
    </WebConfigContext.Provider>
  );
};

export const useWebConfig = () => {
  return useContext(WebConfigContext);
};
