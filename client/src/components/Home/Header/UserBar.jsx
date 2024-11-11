import { FaRegUserCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const UserBar = () => {
  return (
    <div className="relative text-2xl text-gray-50 cursor-pointer group z-30">
      <FaRegUserCircle />
      <div className="absolute w-80 top-14 right-0 bg-gray-100 cursor-default py-4 px-8 text-xs text-center shadow-md shadow-gray-200 hidden group-hover:block before:absolute before:w-12 before:h-10 before:-top-8 before:right-0 before:bg-transparent">
        <p className="font-bold uppercase px-9 leading-5 text-black">
          Chào mừng quý khách đến với w0w Store
        </p>
        <p className="mt-5 text-black">Bạn đã có tài khoản w0wStore</p>
        <NavLink to={'/tai-khoan/dang-nhap'}>
          <button className="w-full h-8 bg-red-700 rounded-md my-3 hover:shadow-md hover:shadow-gray-300">
            Đăng nhập
          </button>
        </NavLink>
        <p className="pt-3 border-t border-gray-200 mb-3 text-black">hoặc</p>
        <NavLink to={'/tai-khoan/dang-ky'}>
          <button className="w-full h-8 bg-white rounded-md text-black border-solid border-2 hover:bg-red-700 hover:text-white hover:border-red-700 transform transition duration-300">
            Đăng ký thành viên
          </button>
        </NavLink>
      </div>
    </div>
  );
};

UserBar.propTypes = {};

export default UserBar;
