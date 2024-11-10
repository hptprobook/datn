/* eslint-disable */

import { createContext, useState, useContext } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState();

  const value = {
    socket,
    onlineUser,
    setOnlineUser,
    setSocket,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
