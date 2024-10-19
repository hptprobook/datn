import { useEffect } from 'react';
import './style.css';

const MainLoading = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="mainLoading">
      <div className="main-loader"></div>
    </div>
  );
};

export default MainLoading;
