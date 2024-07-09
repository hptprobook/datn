import { NavLink } from 'react-router-dom';
import AuthBanner from '~/components/Auth/AuthBanner';
import AuthButton from '~/components/common/Button/AuthButton';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_Full from '~/components/common/TextField/InputField_Full';

export default function LoginPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <AuthBanner />

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl w-full">
            <BackToHome />
            <form action="#" className="mt-12 grid grid-cols-6 gap-6">
              <InputField_Full
                id="Email"
                label="Địa chỉ Email"
                name="email"
                type="email"
              />

              <InputField_Full
                id="Password"
                label="Mật khẩu"
                name="password"
                type="password"
              />

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
                <AuthButton text={'Đăng nhập'} />

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
