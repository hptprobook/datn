import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';

const UserLoggedBar = ({ currentUserInfor }) => {
  const { logout } = useCheckAuth();
  const handleLogout = () => {
    logout();
  };
  let avatarUrl = '';
  if (currentUserInfor?.avatar) {
    avatarUrl =
      currentUserInfor.avatar.startsWith('http://') ||
      currentUserInfor.avatar.startsWith('https://')
        ? currentUserInfor.avatar
        : `${import.meta.env.VITE_SERVER_URL}/${currentUserInfor.avatar}`;
  }

  return (
    <div className="relative text-2xl text-gray-50 cursor-pointer group z-50">
      {currentUserInfor?.avatar ? (
        <NavLink to={'/nguoi-dung/tai-khoan'}>
          <div className="">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
        </NavLink>
      ) : (
        <Icon icon="solar:user-id-outline" />
      )}
      <div className="absolute min-w-64 top-11 right-0 bg-gray-100 text-black cursor-default py-4 text-xs shadow-md shadow-gray-200 hidden group-hover:block before:absolute before:w-8 before:h-5 before:-top-5 before:right-0 before:bg-transparent">
        <NavLink
          to={'/nguoi-dung/tai-khoan'}
          className="flex items-center border-b pb-4 px-8"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {currentUserInfor?.avatar ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Icon icon="mdi:user" className="w-8 h-8 text-red-600" />
            )}
          </div>
          <div className="pl-6">
            <p className="text-black">Xin chào,</p>
            <p className="font-bold uppercase text-black">
              {currentUserInfor?.name}
            </p>
          </div>
        </NavLink>
        <div className="mt-3">
          <div className="hover:bg-gray-200 hover:text-red-600">
            <NavLink
              to={'/nguoi-dung/tai-khoan'}
              className="flex items-center py-3 text-sm  px-8"
            >
              <Icon icon="solar:user-linear" className="text-xl" />
              <span className="pl-3">Hồ sơ</span>
            </NavLink>
          </div>
          <div className="hover:bg-gray-200 hover:text-red-600">
            <NavLink
              to={'/nguoi-dung'}
              className="flex items-center py-3 text-sm  px-8"
            >
              <Icon icon="circum:view-list" className="text-xl" />
              <span className="pl-3">Đơn hàng</span>
            </NavLink>
          </div>
          <div className="hover:bg-gray-200 hover:text-red-600">
            <NavLink
              to={'/nguoi-dung/san-pham-da-xem'}
              className="flex items-center py-3 text-sm  px-8"
            >
              <Icon icon="pepicons-pop:eye" className="text-xl" />
              <span className="pl-3">Sản phẩm đã xem</span>
            </NavLink>
          </div>
          <div
            className="hover:bg-gray-200 hover:text-red-600"
            onClick={handleLogout}
          >
            <div className="flex items-center py-3 text-sm px-8 cursor-pointer">
              <Icon icon="system-uicons:wrap-back" className="text-xl" />
              <span className="pl-3">Đăng xuất</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserLoggedBar.propTypes = {};

export default UserLoggedBar;
