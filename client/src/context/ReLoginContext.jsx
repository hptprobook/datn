import { createContext, useState, useContext, useRef } from 'react';
import NotifyConfirm from '~/components/common/Confirm/NotifyConfirm';

const NotifyContext = createContext();

export const NotifyProvider = ({ children }) => {
  const [showNotify, setShowNotify] = useState(false);
  const notifyCallbackRef = useRef(null);

  const openNotify = (callback) => {
    notifyCallbackRef.current = callback;
    setShowNotify(true);
  };

  const closeNotify = () => {
    setShowNotify(false);
    notifyCallbackRef.current = null;
  };

  const handleConfirm = () => {
    if (notifyCallbackRef.current) {
      notifyCallbackRef.current();
    }
    closeNotify();
  };

  return (
    <NotifyContext.Provider value={{ openNotify, closeNotify }}>
      {children}
      {showNotify && (
        <NotifyConfirm
          msg="Phiên đăng nhập hết hạn. Bạn có muốn đăng nhập lại?"
          onConfirm={handleConfirm}
          icon="streamline:login-1-solid"
        />
      )}
    </NotifyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotify = () => useContext(NotifyContext);
