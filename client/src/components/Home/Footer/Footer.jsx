import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useWebConfig } from '~/context/WebsiteConfig';
import { env } from '~/utils/constants';

const Footer = () => {
  const { config } = useWebConfig();

  const socialLinks = [
    { name: 'Facebook', icon: 'ic:baseline-facebook', url: config?.FanpageFb },
    { name: 'Instagram', icon: 'mdi:instagram', url: config?.Instagram },
    { name: 'Tiktok', icon: 'ic:baseline-tiktok', url: config?.Tiktok },
    { name: 'Youtube', icon: 'line-md:youtube', url: config?.Youtube },
    { name: 'Zalo', icon: 'arcticons:zalo', url: config?.ZaloWeb },
  ];

  const serverUrl = env.SERVER_URL;

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo Section */}
          <div className="flex justify-center flex-col items-center">
            {config?.logo && (
              <div className="flex justify-center text-teal-600 sm:justify-start">
                <img
                  src={`${serverUrl}/${config.logo}`}
                  alt={config?.nameCompany ?? 'Company Logo'}
                  className="w-52"
                />
              </div>
            )}

            <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
              Khám phá bộ sưu tập thời trang chất lượng cao và hợp xu hướng tại{' '}
              <strong>{config?.nameCompany ?? 'Chúng tôi'}</strong>. Cam kết
              mang đến trải nghiệm mua sắm tuyệt vời nhất.
            </p>

            {/* Social Links */}
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(
                (social) =>
                  social.url && (
                    <li key={social.name}>
                      <Link
                        to={social.url}
                        rel="noreferrer"
                        target="_blank"
                        className="text-teal-700 transition hover:text-teal-700/75"
                      >
                        <span className="sr-only">{social.name}</span>
                        <Icon className="text-3xl" icon={social.icon} />
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {/* Về chúng tôi */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">
                Về {config?.nameCompany}
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/ve-chung-toi'}
                  >
                    Chúng tôi là ai
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/cam-ket'}
                  >
                    Cam kết của chúng tôi
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/he-thong-cua-hang'}
                  >
                    Hệ thống cửa hàng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Dịch vụ */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">
                Hỗ trợ khách hàng
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/huong-dan-dat-hang'}
                  >
                    Hướng dẫn đặt hàng
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/phuong-thuc-thanh-toan'}
                  >
                    Phương thức thanh toán
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/chinh-sach-thanh-vien'}
                  >
                    Chính sách thành viên
                  </Link>
                </li>
              </ul>
            </div>

            {/* Chính sách */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">Chính sách</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/chinh-sach-van-chuyen'}
                  >
                    Chính sách vận chuyển
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/chinh-sach-kiem-hang'}
                  >
                    Chính sách kiểm hàng
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/chinh-sach-doi-tra'}
                  >
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/chinh-sach-bao-mat'}
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    to={'/static/dieu-kien-dieu-khoan'}
                  >
                    Điều kiện - Điều khoản
                  </Link>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">Liên hệ</p>

              <ul className="mt-8 space-y-4 text-sm">
                {config?.email && (
                  <li>
                    <Link
                      className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                      to={`mailto:${config.email}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 shrink-0 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="flex-1 text-gray-700">
                        {config.email}
                      </span>
                    </Link>
                  </li>
                )}

                {config?.phone && (
                  <li>
                    <Link
                      className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                      to={`tel:${config.phone}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 shrink-0 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="flex-1 text-gray-700">
                        {config.phone}
                      </span>
                    </Link>
                  </li>
                )}

                {config?.address && (
                  <li className="flex items-start justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <address className="-mt-0.5 flex-1 not-italic text-gray-700">
                      {config.address}
                    </address>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              <span className="block sm:inline">Đã đăng ký bản quyền. </span>
              <Link
                to={'/static/dieu-kien-dieu-khoan'}
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75"
              >
                Điều khoản & Điều kiện
              </Link>
              <span>&middot;</span>
              <Link
                to={'/static/chinh-sach-bao-mat'}
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75"
              >
                Chính sách bảo mật
              </Link>
            </p>
            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} w0wTeam - FPT Polytechnic Tay
              Nguyen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
