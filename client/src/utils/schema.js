import * as Yup from 'yup';

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Họ là bắt buộc')
    .min(3, 'Họ phải có ít nhất 3 ký tự')
    .max(15, 'Họ không được vượt quá 15 ký tự'),
  last_name: Yup.string()
    .required('Tên là bắt buộc')
    .min(3, 'Tên phải có ít nhất 3 ký tự')
    .max(15, 'Tên không vượt quá 15 ký tự'),
  email: Yup.string()
    .email('Định dạng email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .trim()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Định dạng email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .trim()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
});
