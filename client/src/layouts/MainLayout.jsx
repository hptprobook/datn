import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';

export default function MainLayout() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handlePreviewOpen = (event) => {
      setIsPreviewOpen(event.detail);
    };

    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);

      if (currentPosition === 0) {
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
  }, [isHeaderVisible]);

  const toggleHeaderVisibility = () => {
    if (scrollPosition > 0) {
      setIsHeaderVisible((prev) => !prev);
    }
  };

  return (
    <main className="bg-white">
      <div
        className={`top-0 z-[1000] transition-transform duration-300 ${
          !isPreviewOpen ? 'sticky' : ''
        } ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <Header />
        <NavBar />
      </div>
      {scrollPosition > 0 && (
        <div className="fixed top-4 right-12 z-[1001]">
          <input
            type="checkbox"
            id="headerToggle"
            className="hidden"
            checked={isHeaderVisible}
            onChange={toggleHeaderVisibility}
          />
          <label
            htmlFor="headerToggle"
            className="toggle cursor-pointer block w-6 h-6 relative"
          >
            <div className="absolute inset-0 flex flex-col justify-around">
              <div
                className={`h-1 bg-blue-600 transition-all duration-300 ${
                  isHeaderVisible ? 'rotate-45 translate-y-[0.48rem]' : ''
                }`}
              ></div>
              <div
                className={`h-1 bg-blue-600 transition-all duration-300 ${
                  isHeaderVisible ? 'opacity-0' : ''
                }`}
              ></div>
              <div
                className={`h-1 bg-blue-600 transition-all duration-300 ${
                  isHeaderVisible ? '-rotate-45 -translate-y-[0.48rem]' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>
      )}
      <div className="mt-8">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
