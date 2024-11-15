import { PiShoppingCartBold } from 'react-icons/pi';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserBar from '~/components/Home/Header/UserBar';
import SideNavMenu from './Responsive/SideNavMenu';
import SearchBar from './Search/SearchBar';
import SearchResponsiveModal from './Responsive/SearchResponsiveModal';
import CartFixed from './CartFixed';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { useCart } from 'react-use-cart';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import UserLoggedBar from './UserLoggedBar';
import WishList from '~/components/common/Product/WishList';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '~/APIs';
import { useUser } from '~/context/UserContext';
import { useWebConfig } from '~/context/WebsiteConfig';
import NotifyBar from './NotifyBar';
import socket from '~/config/socket';
import { useSwalWithConfirm } from '~/customHooks/useSwal';
// import { useSocketContext } from '~/context/SocketContext';
// import { io } from 'socket.io-client';

const Header = () => {
  const { isAuthenticated } = useCheckAuth();

  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Danh mục');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user } = useUser();
  const { config } = useWebConfig();
  const { items } = useCart();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    // Tham gia Room dựa trên userId
    socket.emit('online', user?._id);

    // Lắng nghe thông báo mới từ server
    socket.on('orderStatusUpdate', (notifyData) => {
      useSwalWithConfirm
        .fire({
          icon: 'info',
          title: 'Thông báo',
          text: notifyData.description,
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Kiểm tra',
        })
        .then((result) => {
          if (result.isDismissed) {
            navigate(`/nguoi-dung/don-hang/${notifyData.orderCode}`);
          }
        });
    });

    // Cleanup
    return () => {
      socket.off('orderStatusUpdate');
    };
  }, [isAuthenticated, user]);
  const currentUserInfor = data ? data : null;

  return (
    <div>
      {/* Header dùng chung cho Window */}
      <WishList
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <header className="w-full h-20 bg-amber-600 hidden lg:block text-black">
        <div className="max-w-container h-full mx-auto flex justify-between items-center">
          <NavLink to="/">
            <div>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${config?.logo}`}
                alt="Logo"
                className="h-full w-48"
              />
            </div>
          </NavLink>
          <SearchBar />
          <div className="flex gap-4">
            {isAuthenticated && (
              <>
                <div
                  className="text-2xl text-gray-50 cursor-pointer relative hover:text-red-600"
                  title="Danh sách yêu thích"
                  onClick={() => setIsWishlistOpen(true)}
                >
                  <Icon icon="line-md:heart" />
                </div>
                <div
                  className="text-2xl text-gray-50 cursor-pointer relative hover:text-red-600"
                  title="Thông báo"
                >
                  <NotifyBar notifies={currentUserInfor?.notifies} />
                  {currentUserInfor?.notifies.some(
                    (notify) => notify.isReaded === false
                  ) && (
                    <div className="absolute -top-2 -right-1 bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs"></div>
                  )}
                </div>
              </>
            )}
            <div
              className="text-2xl text-gray-50 cursor-pointer relative"
              onClick={() => setOpenCart(true)}
            >
              <PiShoppingCartBold />
              <div className="absolute -top-2 -right-3 bg-red-700 text-white rounded-md w-6 h-4 flex items-center justify-center text-xs">
                {isAuthenticated ? user?.carts.length : items.length}
              </div>
            </div>
            <CartFixed open={openCart} setOpen={setOpenCart} />
            <Link to={'/theo-doi-don-hang'}>
              <div className="text-2xl text-gray-50 cursor-pointer">
                <MdOutlineContentPasteSearch />
              </div>
            </Link>
            {/* Kiểm tra trạng thái đăng nhập */}
            {isAuthenticated ? (
              <UserLoggedBar currentUserInfor={currentUserInfor} />
            ) : (
              <UserBar />
            )}
          </div>
        </div>
      </header>

      {/* Header dùng chung cho Mobile & Tablet */}
      <header className="w-full h-16 bg-amber-600 lg:hidden flex justify-between items-center px-4 z-10">
        <div
          className="text-2xl text-gray-50 cursor-pointer"
          onClick={() => setOpenMenu(true)}
        >
          <FaBars />
        </div>
        <NavLink to="/" className="flex-grow text-center">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/${config?.logo}`}
            alt="Logo"
            className="h-16 w-20 mx-auto"
          />
        </NavLink>
        <div className="flex gap-4">
          {isAuthenticated && (
            <>
              <div
                className="text-2xl text-gray-50 cursor-pointer relative hover:text-red-600"
                title="Danh sách yêu thích"
                onClick={() => setIsWishlistOpen(true)}
              >
                <Icon icon="line-md:heart" />
              </div>
              <div
                className="text-2xl text-gray-50 cursor-pointer relative hover:text-red-600"
                title="Thông báo"
              >
                <NotifyBar notifies={currentUserInfor?.notifies} />
                {currentUserInfor?.notifies.some(
                  (notify) => notify.isReaded === false
                ) && (
                  <div className="absolute -top-2 -right-1 bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs"></div>
                )}
              </div>
            </>
          )}
          <div
            className="text-2xl text-gray-50 cursor-pointer"
            onClick={() => setOpenSearch(true)}
          >
            <IoIosSearch />
          </div>
          <div
            className="text-2xl text-gray-50 cursor-pointer relative"
            onClick={() => setOpenCart(true)}
          >
            <PiShoppingCartBold />
            <div className="absolute -top-2 -right-3 bg-red-700 text-white rounded-md w-6 h-4 flex items-center justify-center text-xs">
              {items.length}
            </div>
          </div>
          <CartFixed open={openCart} setOpen={setOpenCart} />
        </div>
      </header>

      {/* Side Nav Menu */}
      <SideNavMenu
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
      />

      {/* Search Drawer for Mobile & Tablet */}
      <SearchResponsiveModal
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
    </div>
  );
};

Header.propTypes = {
  openCart: PropTypes.bool,
  setOpenCart: PropTypes.func,
  openMenu: PropTypes.bool,
  setOpenMenu: PropTypes.func,
  currentTitle: PropTypes.string,
  setCurrentTitle: PropTypes.func,
};

export default Header;
