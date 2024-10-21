// import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const UserAddress = () => {
  return (
    <div className="p-4 shadow-md text-gray-900 rounded-sm bg-gray-50">
      <div className="flex items-center text-red-600">
        <Icon icon="basil:location-solid" />
        <h3 className="ml-2 font-semibold">Địa Chỉ Nhận Hàng</h3>
      </div>
      <div className="mt-4">
        <div className="block md:flex gap-3 items-center ">
          <p className="font-bold">PHAN THANH HOÁ</p>
          <p className="font-bold text-gray-500">(+84) 332741249</p>
        </div>
        <div className="block md:flex justify-between items-center">
          <div className="md:flex gap-2 md:items-center">
            <p className="text-sm">
              45/19, Nguyễn Viết Xuân, Phường Tân Thành, Thành Phố Buôn Ma
              Thuột, Đắk Lắk
            </p>
            <div className="badge badge-success rounded-md mt-2 md:mt-0">
              Mặc định
            </div>
          </div>
          <button className="text-blue-500 hover:underline hover:text-red-600 mt-2 md:mt-0">
            Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

UserAddress.propTypes = {};

export default UserAddress;
