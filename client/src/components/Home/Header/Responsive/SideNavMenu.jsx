import { useState, useEffect } from 'react';
import { FaAngleRight, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { menu } from '~/apis/mock_data';
import Logo from '~/assets/logo2.png';

export default function SideNavMenu({
  openMenu,
  setOpenMenu,
  currentTitle,
  setCurrentTitle,
}) {
  const [menuPath, setMenuPath] = useState([]);
  const [animateMenu, setAnimateMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      setAnimateMenu(true);
    } else {
      const timeout = setTimeout(() => setAnimateMenu(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [openMenu]);

  const handleMenuClick = (menuItem) => {
    setMenuPath([...menuPath, menuItem]);
    setCurrentTitle(menuItem.title);
  };

  const handleBackClick = () => {
    const newPath = menuPath.slice(0, -1);
    setMenuPath(newPath);
    setCurrentTitle(
      newPath.length > 0 ? newPath[newPath.length - 1].title : 'Danh mục'
    );
  };

  const currentMenu =
    menuPath.length === 0 ? menu : menuPath[menuPath.length - 1].list || [];

  return (
    <div className="z-10">
      {animateMenu && (
        <div>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transform transition-transform duration-300"
            onClick={() => setOpenMenu(false)}
          />
          <div
            className={`fixed top-0 left-0 w-3/4 md:w-2/5 h-full overflow-y-auto bg-white shadow-lg z-30 transition-transform duration-300 ${
              openMenu ? 'animate-slideIn' : 'animate-slideOut'
            }`}
          >
            <div className="h-16 bg-amber-600 flex items-center px-4 justify-between">
              {menuPath.length > 0 ? (
                <FaArrowLeft
                  className="text-2xl text-gray-50 cursor-pointer"
                  onClick={handleBackClick}
                />
              ) : (
                <FaBars
                  className="text-2xl text-gray-50 cursor-pointer"
                  onClick={() => setOpenMenu(false)}
                />
              )}
              <div className="flex-grow text-center text-white text-lg">
                {currentTitle}
              </div>
              <FaTimes
                className="text-2xl text-gray-50 cursor-pointer"
                onClick={() => setOpenMenu(false)}
              />
            </div>
            <div className="flex justify-center">
              <img src={Logo} alt="Logo" className="h-full w-56" />
            </div>
            <div className="p-6">
              {currentMenu?.map((item) => (
                <div
                  key={item.id}
                  className="mb-6 flex justify-between items-center font-medium"
                >
                  <p className="cursor-pointer hover:text-red-500 flex-grow">
                    {item.title}
                  </p>
                  {item.list && (
                    <button className="text-gray-500 hover:text-red-500">
                      <FaAngleRight onClick={() => handleMenuClick(item)} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 font-bold text-lg">
              <NavLink
                to={'/tai-khoan/dang-nhap'}
                className={'hover:text-red-500'}
              >
                Đăng nhập
              </NavLink>
              <p>|</p>
              <NavLink
                to={'/tai-khoan/dang-ky'}
                className={'hover:text-red-500'}
              >
                Đăng ký
              </NavLink>
            </div>
            <div className="p-6">
              <a
                href="#"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full justify-center"
              >
                Tra cứu đơn hàng
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}