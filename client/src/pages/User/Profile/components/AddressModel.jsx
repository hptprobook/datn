import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import InputField_50 from '~/components/common/TextField/InputField_50';
import SearchableSelect from '~/components/common/Select/SearchableSelect';

const AddressModel = ({ onClose, isOpen, address }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    address: '',
  });

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.name || '',
        phone: address.phone || '',
        email: address.email || '',
        province: '', // Set giá trị mặc định cho tỉnh
        district: '', // Set giá trị mặc định cho quận/huyện
        ward: '', // Set giá trị mặc định cho xã/phường
        address: address.address || '',
      });
    }
  }, [address]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isClosing) {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true); // Bắt đầu quá trình đóng với hiệu ứng
    setTimeout(() => {
      setIsClosing(false);
      onClose(); // Thực hiện đóng modal sau khi hiệu ứng trượt lên hoàn tất
    }, 300); // Đảm bảo thời gian này khớp với thời gian hiệu ứng `slideUp`
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const provinceOptions = [
    { value: 'Hanoi', label: 'Hà Nội' },
    { value: 'HCM', label: 'TP Hồ Chí Minh' },
  ];

  const districtOptions = [
    { value: 'District1', label: 'Quận 1' },
    { value: 'District2', label: 'Quận 2' },
  ];

  const wardOptions = [
    { value: 'Ward1', label: 'Phường 1' },
    { value: 'Ward2', label: 'Phường 2' },
  ];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen || isClosing ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      <div
        className={`relative bg-white p-6 rounded-md shadow-lg z-10 w-2/3 transform ${
          isOpen && !isClosing ? 'animate-slideDown' : 'animate-slideUp'
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={handleClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className="font-bold text-black mb-4">
          {address ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI'}
        </h2>
        <form className="mt-12 grid gap-6">
          <InputField_50
            id="Họ tên"
            label="Họ tên"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <InputField_50
            id="Số điện thoại"
            label="Số điện thoại"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <InputField_50
            id="Email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-3 gap-4 col-span-6">
            <SearchableSelect
              id="province"
              label="Tỉnh"
              name="province"
              options={provinceOptions}
              value={formData.province}
              onChange={(option) =>
                setFormData({ ...formData, province: option.value })
              }
            />
            <SearchableSelect
              id="district"
              label="Quận/Huyện"
              name="district"
              options={districtOptions}
              value={formData.district}
              onChange={(option) =>
                setFormData({ ...formData, district: option.value })
              }
            />
            <SearchableSelect
              id="ward"
              label="Xã/Phường"
              name="ward"
              options={wardOptions}
              value={formData.ward}
              onChange={(option) =>
                setFormData({ ...formData, ward: option.value })
              }
            />
          </div>

          <InputField_Full
            id="address"
            label="Địa chỉ"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
          />

          <div>
            <button className="btn btn-error rounded-md mt-4 px-12">
              {address ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressModel.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  address: PropTypes.object, // Có thể là null khi thêm mới
};

export default AddressModel;
