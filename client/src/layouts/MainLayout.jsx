import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';
// import { SocketProvider } from '~/context/SocketContext';

export default function MainLayout() {
  const location = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const isSpecialRoute = [
    '/gio-hang',
    '/thanh-toan',
    '/thanh-toan/xac-nhan',
  ].includes(location.pathname);

  useEffect(() => {
    if (isSpecialRoute) return;

    const handlePreviewOpen = (event) => {
      setIsPreviewOpen(event.detail);
    };

    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        setIsHeaderVisible(true);
      } else if (currentPosition === 0) {
        setIsHeaderVisible(true);
      } else if (currentPosition > 0 && isHeaderVisible) {
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener('previewOpen', handlePreviewOpen);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('previewOpen', handlePreviewOpen);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeaderVisible, isSpecialRoute]);

  const toggleHeaderVisibility = () => {
    if (scrollPosition > 0) {
      setIsHeaderVisible((prev) => !prev);
    }
  };

  return (
    <main className="bg-white">
      <div
        className={`top-0 z-[1000] transition-transform duration-300 ${
          !isPreviewOpen && !isSpecialRoute ? 'sticky' : 'relative'
        } ${
          isHeaderVisible || isSpecialRoute
            ? 'translate-y-0'
            : '-translate-y-full'
        }`}
      >
        <Header />
        <NavBar />
      </div>
      {!isSpecialRoute && scrollPosition > 0 && window.innerWidth > 768 && (
        <div className="fixed top-4 right-12 z-[1001]">
          <button
            onClick={toggleHeaderVisibility}
            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-5 h-5 text-white transition-transform duration-300 ${
                isHeaderVisible ? 'rotate-180' : ''
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="mt-8">
        <Outlet />
      </div>
      {!isSpecialRoute && <Footer />}
    </main>
  );
}
