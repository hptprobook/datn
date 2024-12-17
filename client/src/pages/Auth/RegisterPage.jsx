import { useFormik } from 'formik';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthBanner from '~/components/Auth/AuthBanner';
import RegisterBottom from '~/components/Auth/RegisterBottom';
import AuthButton from '~/components/common/Button/AuthButton';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_50 from '~/components/common/TextField/InputField_50';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import { RegisterSchema } from '~/utils/schema';
import { register } from '~/APIs';
import { useMutation } from '@tanstack/react-query';
import { handleToast } from '~/customHooks/useToast';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { Helmet } from 'react-helmet-async';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>BMT Life | Đăng ký </title>
      </Helmet>

      <RegisterPageUI />
    </>
  );
};

const RegisterPageUI = () => {
  const { login } = useCheckAuth();
  const navigate = useNavigate();

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    allowNotifies: false,
  };

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      handleToast('success', 'Đăng ký thành công!');
      login(data.token);

      setTimeout(() => {
        const referrer = document.referrer;
        if (
          referrer &&
          !referrer.includes('/tai-khoan/dang-nhap') &&
          !referrer.includes('/tai-khoan/dang-ky')
        ) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }, 1000);
    },
    onError: (error) => {
      handleToast('error', error.message);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const payload = {
        name: `${values.first_name} ${values.last_name}`,
        email: values.email,
        password: values.password,
      };

      if (values.allowNotifies) {
        payload.allowNotifies = true;
      }

      mutation.mutate(payload);
    },
  });

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <AuthBanner type={'register'} />
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <BackToHome />
            <form
              onSubmit={formik.handleSubmit}
              className="mt-12 grid grid-cols-6 gap-6"
            >
              <InputField_50
                id="FirstName"
                label="Họ"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && formik.errors.first_name}
              />
              <InputField_50
                id="LastName"
                label="Tên"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && formik.errors.last_name}
              />

              <InputField_Full
                id="Email"
                label="Địa chỉ Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />

              <InputField_50
                id="Password"
                label="Mật khẩu"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
              <InputField_50
                id="PasswordConfirmation"
                label="Xác nhận mật khẩu"
                name="password_confirmation"
                type="password"
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password_confirmation &&
                  formik.errors.password_confirmation
                }
              />

              <RegisterBottom
                checked={formik.values.marketing_accept}
                onChange={formik.handleChange}
              />

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <AuthButton
                  text="Tạo tài khoản"
                  type="submit"
                  isLoading={mutation.isPending}
                />
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Đã có tài khoản.
                  <NavLink
                    to="/tai-khoan/dang-nhap"
                    className="text-blue-700 underline hover:text-red-500"
                  >
                    Đăng nhập
                  </NavLink>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

RegisterPage.propTypes = {};

export default RegisterPage;
