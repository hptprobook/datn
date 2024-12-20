import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import { loginAuth, loginGoogleAPI, updateCurrentUser } from '~/APIs';
import AuthBanner from '~/components/Auth/AuthBanner';
import AuthButton from '~/components/common/Button/AuthButton';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import { handleApiError } from '~/config/helpers';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { handleToast } from '~/customHooks/useToast';
import { loginSchema } from '~/utils/schema';
import ObjectID from 'bson-objectid';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { io } from 'socket.io-client';
// import { useSocketContext } from '~/context/SocketContext';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>BMT Life | Đăng nhập </title>
      </Helmet>
      <LoginPageUI />
    </>
  );
};

const LoginPageUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCheckAuth();
  const { items, emptyCart } = useCart();

  const specialRoutes = [
    '/tai-khoan',
    '/tai-khoan/dang-nhap',
    '/tai-khoan/dang-ky',
    '/tai-khoan/quen-mat-khau',
    '/thanh-toan',
    '/thanh-toan/xac-nhan',
  ];

  const isSpecialRoute = specialRoutes.includes(location.pathname);

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  // const { socket, onlineUser, setOnlineUser, setSocket } = useSocketContext();
  const initialValues = {
    email: '',
    password: '',
  };

  const handleLoginSuccess = (data) => {
    handleToast('success', 'Đăng nhập thành công!');
    login(data.token);

    handleCartAfterLogin(data);

    setTimeout(() => {
      if (!isSpecialRoute) {
        navigate(-1); // Quay lại trang trước nếu không phải route đặc biệt
      } else {
        navigate('/'); // Điều hướng đến trang chính nếu đang ở route đặc biệt
      }
    }, 500);
  };

  const loginGoogle = useMutation({
    mutationFn: loginGoogleAPI,
    onSuccess: (data) => {
      setTimeout(() => {
        handleLoginSuccess(data);
      }, 500);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        loginGoogle.mutate({
          email: user.email,
          name: user.displayName,
        });
      })
      .catch(() => {
        handleToast('error', 'Có lỗi xảy ra, vui lòng thử lại');
      });
  };

  const handleCartAfterLogin = async (data) => {
    items.forEach((cartItem) => {
      const existingItemIndex = data.carts.findIndex(
        (item) =>
          item.productId === cartItem.productId &&
          item.variantColor === cartItem.variantColor &&
          item.variantSize === cartItem.variantSize
      );

      if (existingItemIndex !== -1) {
        data.carts[existingItemIndex].quantity += cartItem.quantity;
        data.carts[existingItemIndex].itemTotal +=
          cartItem.price * cartItem.quantity;
      } else {
        const { id, ...rest } = cartItem;
        data.carts.push({
          _id: ObjectID(id).toString(),
          ...rest,
        });
      }
    });

    await updateCurrentUser({ carts: data.carts });
    emptyCart();
  };

  const mutation = useMutation({
    mutationFn: loginAuth,
    onSuccess: (data) => {
      setTimeout(() => {
        handleLoginSuccess(data);
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
        <AuthBanner type={'login'} />

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
                <p className="text-center text-gray-500">hoặc</p>
              </div>
              <div className="col-span-6" onClick={handleLoginGoogle}>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="px-12 py-2 border flex gap-2 border-slate-200  rounded-lg text-slate-700 hover:text-slate-900  hover:shadow transition duration-150"
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

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Quên mật khẩu ?{' '}
                  <NavLink
                    to={'/tai-khoan/quen-mat-khau'}
                    className="text-gray-700 underline hover:text-red-500"
                  >
                    Lấy lại mật khẩu
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

LoginPage.propTypes = {};

export default LoginPage;
