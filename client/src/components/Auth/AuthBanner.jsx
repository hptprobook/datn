import { NavLink } from 'react-router-dom';
import { useWebConfig } from '~/context/WebsiteConfig';

const AuthBanner = ({ type }) => {
  const { config } = useWebConfig();
  return (
    <section className="relative flex h-32 md:h-80 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
        src={`${import.meta.env.VITE_SERVER_URL}/${config?.loginScreen}`}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      <div className="hidden lg:relative lg:block lg:p-12">
        <NavLink to={'/'} className="block text-white">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/${config?.darkLogo}`}
            alt=""
          />
        </NavLink>

        {type === 'forgot' ? (
          <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Lấy lại mật khẩu
          </h2>
        ) : (
          <>
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {type === 'login'
                ? 'Chào mừng bạn trở lại'
                : 'Chào mừng bạn đến với'}{' '}
              {config?.nameCompany}
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              {type === 'login'
                ? 'Đăng nhập vào tài khoản của bạn để tiếp tục'
                : 'Đăng ký tài khoản ngay để'}{' '}
              mua sắm và khám phá những ưu đãi đặc biệt dành riêng cho bạn.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

AuthBanner.propTypes = {};

export default AuthBanner;
