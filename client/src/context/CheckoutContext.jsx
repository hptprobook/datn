/* eslint-disable */

import { createContext, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

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

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      province_id: '',
      province_name: '',
      district_id: '',
      district_name: '',
      ward_id: '',
      ward_name: '',
      address: '',
      fullAddress: '',
      note: '',
      payment: 'COD',
    },
    validationSchema,
    onSubmit: (values) => {
      //
    },
  });

  const value = {
    selectedItems,
    setSelectedItems,
    formik,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};
