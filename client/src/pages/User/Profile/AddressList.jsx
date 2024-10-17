import { useState } from 'react';
import AddressModel from './components/AddressModel';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '~/APIs';

const AddressList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: getCurrentUser,
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">ĐỊA CHỈ GIAO HÀNG</h1>
      <div className="mt-4">
        {user?.addresses.map((address, index) => (
          <div
            key={index}
            className="rounded-sm border-b py-4 w-full grid grid-cols-12 gap-4"
          >
            <div className="col-span-8 flex flex-col gap-2">
              <div className="flex gap-3">
                <p className="font-bold">{address?.name}</p>
                {address?.isDefault && (
                  <span className="badge badge-success rounded-md">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="break-words w-full">
                <b>Địa chỉ: </b>
                {address?.address}
              </p>
              <p>
                <b>Điện thoại: </b>
                {address?.phone}
              </p>
            </div>
            <div className="col-span-4 flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <p
                  className="cursor-pointer font-bold"
                  onClick={() => handleEditAddress(address)}
                >
                  Chỉnh sửa
                </p>
              </div>
              <p className="cursor-pointer font-bold text-red-500">Xoá</p>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            onClick={handleOpenModal}
            className="w-full font-bold rounded-md border-dashed border-2 border-black py-2 hover:bg-red-600 hover:text-white hover:border-white transition duration-300 ease-in-out"
          >
            Thêm địa chỉ mới
          </button>
          {isModalOpen && (
            <AddressModel
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              address={editingAddress}
              refetchUser={refetchUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
