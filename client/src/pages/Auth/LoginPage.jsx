import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginAuth } from '~/APIs';
import AuthBanner from '~/components/Auth/AuthBanner';
import AuthButton from '~/components/common/Button/AuthButton';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import { handleApiError } from '~/config/helpers';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { handleToast } from '~/customHooks/useToast';
import { loginSchema } from '~/utils/schema';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useCheckAuth();

  const initialValues = {
    email: '',
    password: '',
  };

  const mutation = useMutation({
    mutationFn: loginAuth,
    onSuccess: (data) => {
      handleToast('success', 'Đăng nhập thành công!');
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
      handleApiError(error);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const payload = {
        email: values.email,
        password: values.password,
      };

      mutation.mutate(payload);
    },
  });

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <AuthBanner />

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl w-full">
            <BackToHome />
            <form
              onSubmit={formik.handleSubmit}
              className="mt-12 grid grid-cols-6 gap-6"
            >
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

              <InputField_Full
                id="Password"
                label="Mật khẩu"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <AuthButton
                  text={'Đăng nhập'}
                  type="submit"
                  isLoading={mutation.isPending}
                />

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Chưa có tài khoản?{' '}
                  <NavLink
                    to={'/tai-khoan/dang-ky'}
                    className="text-gray-700 underline hover:text-red-500"
                  >
                    Tạo tài khoản
                  </NavLink>
                  .
                </p>
              </div>

              <div className="col-span-6 flex items-center justify-center">
                <p className="text-center">hoặc</p>
              </div>
              <div className="col-span-6">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="px-12 py-2 border flex gap-2 border-slate-200  rounded-lg text-slate-700 dark:text-slate-200  hover:text-slate-900  hover:shadow transition duration-150"
                  >
                    <img
                      className="w-6 h-6"
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      loading="lazy"
                      alt="google logo"
                    />
                    <span>Đăng nhập với Google</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
