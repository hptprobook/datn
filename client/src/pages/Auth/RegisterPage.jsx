import { NavLink } from 'react-router-dom';
import AuthBanner from '~/components/Auth/AuthBanner';
import RegisterBottom from '~/components/Auth/RegisterBottom';
import AuthButton from '~/components/common/Button/AuthButton';
import BackToHome from '~/components/common/Route/BackToHome';
import InputField_50 from '~/components/common/TextField/InputField_50';
import InputField_Full from '~/components/common/TextField/InputField_Full';

export default function RegisterPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <AuthBanner />
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <BackToHome />
            <form action="#" className="mt-12 grid grid-cols-6 gap-6">
              <InputField_50 id="FirstName" label="Họ" name="first_name" />
              <InputField_50 id="LastName" label="Tên" name="last_name" />

              <InputField_Full
                id={'Email'}
                label={'Địa chỉ Email'}
                name={'email'}
                type="email"
              />

              <InputField_50
                id="Password"
                label="Mật khẩu"
                name="password"
                type="password"
              />
              <InputField_50
                id="PasswordConfirmation"
                label="Xác nhận mật khẩu"
                name="password_confirmation"
                type="password"
              />

              <RegisterBottom />

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <AuthButton text={'Tạo tài khoản'} />

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Đã có tài khoản.{' '}
                  <NavLink
                    to={'/tai-khoan/dang-nhap'}
                    className="text-gray-700 underline hover:text-red-500"
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
}
