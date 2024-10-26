import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import InputField_50 from '~/components/common/TextField/InputField_50';
import SearchableSelect from '~/components/common/Select/SearchableSelect';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAllProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from '~/APIs/address';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '~/context/UserContext';
import { updateCurrentUser } from '~/APIs';
import { useSwal } from '~/customHooks/useSwal';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Họ tên không được để trống')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ tên không được vượt quá 50 ký tự'),
  phone: Yup.string()
    .required('Số điện thoại không được để trống')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  province_id: Yup.string().required('Vui lòng chọn tỉnh / thành phố'),
  district_id: Yup.string().required('Vui lòng chọn quận / huyện'),
  ward_id: Yup.string().required('Vui lòng chọn xã / phường'),
  address: Yup.string()
    .required('Địa chỉ không được để trống')
    .min(3, 'Địa chỉ phải có ít nhất 3 ký tự')
    .max(100, 'Địa chỉ không được vượt quá 100 ký tự'),
});

const AddressModel = ({
  onClose,
  isOpen,
  address,
  refetchUser,
  onBack = null,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const { user, setUserInfo } = useUser();

  const formik = useFormik({
    initialValues: {
      name: address?.name || '',
      phone: address?.phone || '',
      email: address?.email || '',
      province_id: address?.province_id || '',
      province_name: address?.province_name || '',
      district_id: address?.district_id || '',
      district_name: address?.district_name || '',
      ward_id: address?.ward_id || '',
      ward_name: address?.ward_name || '',
      address: address?.address || '',
      fullAddress: address?.fullAddress || '',
      isDefault: address?.isDefault || false,
    },
    validationSchema,
    onSubmit: (values) => {
      let updatedAddresses;
      const fullAddress = `${values.address}, ${values.ward_name}, ${values.district_name}, ${values.province_name}`;

      const updatedValues = {
        ...values,
        fullAddress,
      };

      if (updatedValues.isDefault) {
        updatedAddresses = user.addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      } else {
        updatedAddresses = [...user.addresses];
      }

      if (address) {
        updatedAddresses = updatedAddresses.map((addr) =>
          addr._id === address._id ? updatedValues : addr
        );
      } else {
        updatedAddresses.push(updatedValues);
      }

      setUserInfo({ ...user, addresses: updatedAddresses });
      mutation.mutate({ name: user.name, addresses: updatedAddresses });
    },
  });

  const mutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      onBack ? onBack() : onClose();
      refetchUser();
      useSwal.fire({
        title: 'Thành công!',
        icon: 'success',
      });
    },
    onError: () => {
      useSwal.fire({
        title: 'Thất bại!',
        icon: 'error',
      });
    },
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onBack ? onBack() : onClose();
    }, 300);
  };

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => getAllProvinces(),
  });

  const { data: districts, refetch: refetchDistricts } = useQuery({
    queryKey: ['districts', formik.values.province_id],
    queryFn: () => getDistrictsByProvinceId(formik.values.province_id),
    enabled: !!formik.values.province_id && formik.values.province_id != '',
    keepPreviousData: true,
  });

  const { data: wards, refetch: refetchWards } = useQuery({
    queryKey: ['wards', formik.values.district_id],
    queryFn: () => getWardsByDistrictId(formik.values.district_id),
    enabled: !!formik.values.district_id && formik.values.district_id != '',
    keepPreviousData: true,
  });

  const provinceOptions = provinces
    ? provinces.map((province) => ({
        value: province.ProvinceID,
        label: province.ProvinceName,
      }))
    : [];

  const districtOptions = districts
    ? districts.map((district) => ({
        value: district.DistrictID,
        label: district.DistrictName,
      }))
    : [];

  const wardOptions = wards
    ? wards.map((ward) => ({
        value: ward.WardCode,
        label: ward.WardName,
      }))
    : [];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen || isClosing ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={!onBack ? handleClose : onBack}
      ></div>

      <div
        className={`relative bg-white p-6 rounded-md shadow-lg z-10 w-2/3 transform ${
          isOpen && !isClosing ? 'animate-slideDown' : 'animate-slideUp'
        }`}
      >
        {!onBack && (
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <FaTimes size={20} />
          </button>
        )}
        <h2 className="font-bold text-black mb-4">
          {address ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI'}
        </h2>
        <form className="mt-12 grid gap-6" onSubmit={formik.handleSubmit}>
          <InputField_50
            id="name"
            label="Họ tên"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />
          <InputField_50
            id="Số điện thoại"
            label="Số điện thoại"
            name="phone"
            type="text"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone}
          />
          <InputField_50
            id="Email"
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <div className="grid grid-cols-3 gap-4 col-span-6">
            <SearchableSelect
              id="province"
              label="Tỉnh / Thành phố"
              name="province_id"
              options={provinceOptions}
              value={formik.values.province_id}
              defaultValue={'Chọn tỉnh / thành phố'}
              onChange={(option) => {
                formik.setFieldValue('province_id', option.value);
                formik.setFieldValue('province_name', option.label);

                formik.setFieldValue('district_id', '');
                formik.setFieldValue('district_name', '');
                formik.setFieldValue('ward_id', '');
                formik.setFieldValue('ward_name', '');

                refetchDistricts();
              }}
              error={formik.touched.province_id && formik.errors.province_id}
            />

            <SearchableSelect
              id="district"
              label="Quận / Huyện"
              name="district"
              options={districtOptions}
              value={formik.values.district_id}
              onChange={(option) => {
                formik.setFieldValue('district_id', option.value);
                formik.setFieldValue('district_name', option.label);

                formik.setFieldValue('ward_id', '');
                formik.setFieldValue('ward_name', '');

                refetchWards();
              }}
              error={formik.touched.district_id && formik.errors.district_id}
            />
            <SearchableSelect
              id="ward"
              label="Xã / Phường"
              name="ward"
              options={wardOptions}
              value={formik.values.ward_id}
              onChange={(option) => {
                formik.setFieldValue('ward_id', option.value.toString());
                formik.setFieldValue('ward_name', option.label);
              }}
              error={formik.touched.ward_id && formik.errors.ward_id}
            />
          </div>

          <InputField_Full
            id="address"
            label="Địa chỉ"
            name="address"
            type="text"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && formik.errors.address}
          />

          <div>
            <div className="mb-4">
              <label htmlFor="isDefault" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  className="checkbox checkbox-error"
                  checked={formik.values.isDefault}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  className="btn bg-red-600 rounded-md mt-4 px-12"
                  onClick={onBack}
                >
                  Quay lại
                </button>
              )}

              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="btn bg-red-600 rounded-md mt-4 px-12"
              >
                {address ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressModel.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  address: PropTypes.object,
  onBack: PropTypes.func,
};

export default AddressModel;
