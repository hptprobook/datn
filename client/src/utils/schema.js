import * as Yup from 'yup';

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(15, 'Họ không được vượt quá 15 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ không được chứa ký tự đặc biệt hoặc số'),
  last_name: Yup.string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(15, 'Tên không vượt quá 15 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên không được chứa ký tự đặc biệt hoặc số'),
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

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Định dạng email không hợp lệ')
    .required('Email là bắt buộc'),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string().required('Mã OTP là bắt buộc'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});
