// import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useUser } from '~/context/UserContext';
import AddressModel from '~/pages/User/Profile/components/AddressModel';

const UserAddress = ({ userAddress, setUserAddress }) => {
  const { user, refetchUser } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAddressModelOpen, setIsAddressModelOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [tempAddress, setTempAddress] = useState(userAddress);

  const handleClose = () => {
    setIsClosing(true);
    setTempAddress(userAddress);

    setTimeout(() => {
      setIsClosing(false);
      setOpenModal(false);
      setIsAddressModelOpen(false);
      setSelectedAddress(null);
    }, 300);
  };

  const handleConfirmAddress = () => {
    setUserAddress(tempAddress);
    setIsClosing(false);
    setOpenModal(false);
  };

  const handleAddressChange = (address) => {
    setTempAddress(address);
  };

  const handleBackToUserAddress = () => {
    setIsAddressModelOpen(false);
    setOpenModal(true);
  };

  const handleUpdateAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressModelOpen(true);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setIsAddressModelOpen(true);
  };

  useEffect(() => {
    if (user) {
      const nonDefaultAddress = user.addresses.find((addr) => addr.isDefault);
      if (nonDefaultAddress) {
        setUserAddress(nonDefaultAddress);
        setTempAddress(nonDefaultAddress);
      } else {
        setUserAddress(user.addresses[0]);
        setTempAddress(user.addresses[0]);
      }
    }
  }, [user]);

  return (
    <div className="p-4 shadow-md text-gray-900 rounded-sm bg-gray-50">
      <div className="flex items-center text-red-600">
        <Icon icon="basil:location-solid" />
        <h3 className="ml-2 font-semibold">Địa Chỉ Nhận Hàng</h3>
      </div>
      {user?.addresses.length == 0 ? (
        <button
          onClick={handleAddNewAddress}
          className="flex items-center gap-3 border border-gray-400 py-2 px-6 rounded-md my-3 hover:bg-gray-50"
        >
          <Icon icon="ic:twotone-plus" className="text-2xl" /> Thêm địa chỉ mới
        </button>
      ) : (
        <div className="mt-4">
          <div className="block md:flex gap-3 items-center ">
            <p className="font-bold transform uppercase">{userAddress?.name}</p>
            <p className="font-bold text-gray-500">
              (+84) {userAddress?.phone}
            </p>
          </div>
          <div className="block md:flex justify-between items-center">
            <div className="md:flex gap-2 md:items-center">
              <p className="text-sm">{userAddress?.fullAddress}</p>
              {userAddress?.isDefault && (
                <div className="badge badge-success rounded-md mt-2 md:mt-0">
                  Mặc định
                </div>
              )}
            </div>
            <button
              className="text-blue-500 hover:underline hover:text-red-600 mt-2 md:mt-0"
              onClick={() => setOpenModal(true)}
            >
              Thay Đổi
            </button>
          </div>
        </div>
      )}

      {openModal && !isAddressModelOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleClose}
          ></div>
          <div className="bg-white p-6 rounded-lg relative z-10 min-w-[80%] md:min-w-[520px] max-w-[800px] max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={handleClose}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="font-bold text-black mb-4">Thay đổi địa chỉ</h2>
            <div>
              {user?.addresses.map((addr, i) => (
                <div key={i}>
                  <div className="flex gap-4 border-t border-gray-200 py-4">
                    <input
                      id={addr._id}
                      type="radio"
                      className="radio mt-1"
                      name="address"
                      checked={tempAddress?._id === addr._id}
                      onChange={() => handleAddressChange(addr)}
                    />
                    <div className="w-full">
                      <div className="flex justify-between flex-col md:flex-row">
                        <label htmlFor={addr._id} className="flex gap-2 mb-2">
                          <span className="font-bold transform uppercase">
                            {addr.name}
                          </span>
                          {' | '}
                          <span className="text-gray-500 text-md">
                            (+84) {addr.phone}
                          </span>
                        </label>
                        <span
                          className="text-blue-500 hover:underline text-sm cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAddress(addr);
                          }}
                        >
                          Cập nhật
                        </span>
                      </div>
                      <label
                        htmlFor={addr._id}
                        className="text-gray-500 text-sm"
                      >
                        {addr.address}
                      </label>
                      <p>
                        <label
                          htmlFor={addr._id}
                          className="text-gray-500 text-sm"
                        >
                          {addr.ward_name}, {addr.district_name},{' '}
                          {addr.province_name}
                        </label>
                      </p>
                      <div>
                        {addr.isDefault && (
                          <label
                            htmlFor={addr._id}
                            className="badge badge-success rounded-md mt-2"
                          >
                            Mặc định
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddNewAddress}
              className="flex items-center gap-3 border border-gray-400 py-2 px-6 rounded-md my-3 hover:bg-gray-50"
            >
              <Icon icon="ic:twotone-plus" className="text-2xl" /> Thêm địa chỉ
              mới
            </button>
            <div className="flex justify-end gap-3">
              <button
                className="btn bg-red-600 rounded-md mt-4 text-white"
                onClick={handleClose}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="btn bg-red-600 rounded-md mt-4 text-white"
                onClick={handleConfirmAddress}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddressModelOpen && (
        <AddressModel
          isOpen={isAddressModelOpen}
          onClose={handleClose}
          onBack={handleBackToUserAddress}
          address={selectedAddress}
          refetchUser={refetchUser}
        />
      )}
    </div>
  );
};

UserAddress.propTypes = {};

export default UserAddress;
