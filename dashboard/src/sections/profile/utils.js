import * as Yup from 'yup';


export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .nullable()
    .required('Tên không được để trống')
    .min(2, 'Tên quá ngắn')
    .max(60, 'Tên quá dài'),
  address: Yup.string()
    .nullable()
    .required('Địa chỉ không được để trống')
    .min(2, 'Địa chỉ quá ngắn')
    .max(255, 'Địa chỉ quá dài'),
  phone: Yup.string()
    .nullable()
    .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ'),
  bankAccount: Yup.string()
    .nullable()
    .matches(/^[0-9]+$/, 'Số tài khoản không hợp lệ'),
  bankHolder: Yup.string()
    .nullable()
    .min(2, 'Tên chủ tài khoản quá ngắn')
    .max(255, 'Tên chủ tài khoản quá dài'),
  bankName: Yup.string()
    .nullable()
    .min(2, 'Tên ngân hàng quá ngắn')
    .max(255, 'Tên ngân hàng quá dài'),
});
