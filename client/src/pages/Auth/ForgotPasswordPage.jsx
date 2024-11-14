import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet-async';
import AuthBanner from '~/components/Auth/AuthBanner';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import AuthButton from '~/components/common/Button/AuthButton';
import { handleApiError } from '~/config/helpers';
import {
  forgotPasswordSchema,
  otpSchema,
  resetPasswordSchema,
} from '~/utils/schema';
import { getOTP, checkOTP, resetPassword } from '~/APIs';
import { handleToast } from '~/customHooks/useToast';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSwal } from '~/customHooks/useSwal';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>BMT Life | Quên mật khẩu</title>
      </Helmet>
      <ForgotPasswordPageUI />
    </>
  );
};

const ForgotPasswordPageUI = () => {
  const [isOtpSent, setIsOtpSent] = useState(false); // Kiểm tra xem OTP đã được gửi
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Kiểm tra xem OTP đã xác minh
  const [email, setEmail] = useState(''); // Lưu email để sử dụng sau
  const navigate = useNavigate();

  const emailMutation = useMutation({
    mutationFn: getOTP,
    onSuccess: () => {
      setIsOtpSent(true);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const otpMutation = useMutation({
    mutationFn: checkOTP,
    onSuccess: () => {
      handleToast('success', 'Mã OTP hợp lệ! Vui lòng đặt lại mật khẩu.');
      setIsOtpVerified(true);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      useSwal
        .fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Thay đổi mật khẩu thành công!',
          confirmButtonText: 'Đăng nhập',
        })
        .then(() => {
          navigate('/tai-khoan/dang-nhap');
        });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      setEmail(values.email);
      toast.promise(emailMutation.mutateAsync({ email: values.email }), {
        pending: 'Đang gửi yêu cầu...',
        success: 'OTP đã được gửi! Vui lòng kiểm tra email của bạn.',
        error: 'Gửi yêu cầu thất bại. Vui lòng thử lại.',
      });
    },
  });

  const otpFormik = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      otpMutation.mutate({ email, otp: values.otp });
    },
  });

  const resetPasswordFormik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      resetPasswordMutation.mutate({ email, password: values.password });
    },
  });

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <AuthBanner type={'forgot'} />

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl w-full">
            <BackToHome />
            {!isOtpSent ? (
              <form
                onSubmit={emailFormik.handleSubmit}
                className="mt-12 grid grid-cols-6 gap-6"
              >
                <InputField_Full
                  id="Email"
                  label="Địa chỉ Email"
                  name="email"
                  type="email"
                  value={emailFormik.values.email}
                  onChange={emailFormik.handleChange}
                  onBlur={emailFormik.handleBlur}
                  error={emailFormik.touched.email && emailFormik.errors.email}
                />
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <AuthButton
                    text={'Gửi yêu cầu'}
                    type="submit"
                    isLoading={emailMutation.isPending}
                  />
                </div>
              </form>
            ) : !isOtpVerified ? (
              <form
                onSubmit={otpFormik.handleSubmit}
                className="mt-12 grid grid-cols-6 gap-6"
              >
                <InputField_Full
                  id="OTP"
                  label="Mã OTP"
                  name="otp"
                  type="text"
                  value={otpFormik.values.otp}
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  error={otpFormik.touched.otp && otpFormik.errors.otp}
                />
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <AuthButton
                    text={'Xác minh mã OTP'}
                    type="submit"
                    disabled={otpMutation.isPending}
                  />
                </div>
              </form>
            ) : (
              <form
                onSubmit={resetPasswordFormik.handleSubmit}
                className="mt-12 grid grid-cols-6 gap-6"
              >
                <InputField_Full
                  id="Password"
                  label="Mật khẩu mới"
                  name="password"
                  type="password"
                  value={resetPasswordFormik.values.password}
                  onChange={resetPasswordFormik.handleChange}
                  onBlur={resetPasswordFormik.handleBlur}
                  error={
                    resetPasswordFormik.touched.password &&
                    resetPasswordFormik.errors.password
                  }
                />
                <InputField_Full
                  id="ConfirmPassword"
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  value={resetPasswordFormik.values.confirmPassword}
                  onChange={resetPasswordFormik.handleChange}
                  onBlur={resetPasswordFormik.handleBlur}
                  error={
                    resetPasswordFormik.touched.confirmPassword &&
                    resetPasswordFormik.errors.confirmPassword
                  }
                />
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <AuthButton
                    text={'Đặt lại mật khẩu'}
                    type="submit"
                    isLoading={resetPasswordMutation.isPending}
                  />
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

ForgotPasswordPage.propTypes = {};

export default ForgotPasswordPage;
