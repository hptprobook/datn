import { FaHandPointLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import Logo from '~/assets/logo2.png';

export default function LoginPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <NavLink to={'/'} className="block text-white" href="#">
              <img src={Logo} alt="" />
            </NavLink>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Chào mừng bạn trở lại w0wStore
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Đăng nhập vào tài khoản của bạn để tiếp tục mua sắm và khám phá
              những ưu đãi đặc biệt dành riêng cho bạn.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl w-full">
            <NavLink
              to={'/'}
              className="hover:text-red-600 flex items-center gap-4"
            >
              <FaHandPointLeft />
              Về trang chủ
            </NavLink>
            <form action="#" className="mt-12 grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {' '}
                  Địa chỉ Email{' '}
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 border-2 bg-white text-sm text-gray-700 shadow-sm h-10 px-3 outline-blue-500"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 border-2 bg-white text-sm text-gray-700 shadow-sm h-10 px-3 outline-blue-500"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="RememberMe" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="RememberMe"
                    name="remember_me"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                  />
                  <span className="text-sm text-gray-700">Ghi nhớ tôi</span>
                </label>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  Đăng nhập
                </button>

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
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
