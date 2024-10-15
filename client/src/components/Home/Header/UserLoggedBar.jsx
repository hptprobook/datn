import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';

const UserLoggedBar = ({ currentUserInfor }) => {
  const { logout } = useCheckAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative text-2xl text-gray-50 cursor-pointer group z-30">
      {currentUserInfor?.avatar ? (
        <NavLink to={'/nguoi-dung/tai-khoan'}>
          <div className="">{currentUserInfor.avatar}</div>
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
                src={currentUserInfor?.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
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
              to={'/nguoi-dung'}
              className="flex items-center py-3 text-sm  px-8"
            >
              <Icon icon="lets-icons:order-fill" className="text-xl" />
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
          <div className="hover:bg-gray-200 hover:text-red-600">
            <NavLink
              to={'/nguoi-dung/san-pham-yeu-thich'}
              className="flex items-center py-3 text-sm  px-8"
            >
              <Icon icon="mingcute:love-line" className="text-xl" />
              <span className="pl-3">Sản phẩm yêu thích</span>
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
