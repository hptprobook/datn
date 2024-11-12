import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useWebConfig } from '~/context/WebsiteConfig';

const Footer = () => {
  const { config } = useWebConfig();

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo */}
          <div>
            <div className="flex justify-center text-teal-600 sm:justify-start">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${config?.darkLogo}`}
                alt=""
                className="w-52"
              />
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
              Khám phá bộ sưu tập thời trang chất lượng cao và hợp xu hướng tại{' '}
              <strong>{config?.nameCompany}</strong>. Cam kết mang đến trải
              nghiệm mua sắm tuyệt vời nhất.
            </p>
            {/* Socials */}
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <Link
                  to={config?.FanpageFb}
                  rel="noreferrer"
                  target="_blank"
                  className="text-teal-700 transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Facebook</span>
                  <Icon className="text-3xl" icon="ic:baseline-facebook" />
                </Link>
              </li>

              <li>
                <Link
                  to={config?.Instagram}
                  rel="noreferrer"
                  target="_blank"
                  className="text-teal-700 transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Instagram</span>
                  <Icon className="text-3xl" icon="mdi:instagram" />
                </Link>
              </li>

              <li>
                <Link
                  to={config?.Tiktok}
                  rel="noreferrer"
                  target="_blank"
                  className="text-teal-700 transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Tiktok</span>
                  <Icon className="text-3xl" icon="ic:baseline-tiktok" />
                </Link>
              </li>

              <li>
                <Link
                  to={config?.Youtube}
                  rel="noreferrer"
                  target="_blank"
                  className="text-teal-700 transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Youtube</span>
                  <Icon className="text-3xl" icon="line-md:youtube" />
                </Link>
              </li>

              <li>
                <Link
                  to={config?.ZaloWeb}
                  rel="noreferrer"
                  target="_blank"
                  className="text-teal-700 transition hover:text-teal-700/75"
                >
                  <span className="sr-only">Zalo</span>
                  <Icon className="text-3xl" icon="arcticons:zalo" />
                </Link>
              </li>
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
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Cam kết của chúng tôi
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Tin tuyển dụng
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Hệ thống cửa hàng
                  </a>
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
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Hướng dẫn đặt hàng
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Phương thức thanh toán
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Chính sách thành viên
                  </a>
                </li>
              </ul>
            </div>

            {/* Chính sách */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">Chính sách</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Chính sách vận chuyển
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Chính sách kiểm hàng
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                  >
                    Điều kiện - Điều khoản
                  </a>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900">Liên hệ</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    to={`mailto:${config?.email}`}
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
                      {config?.email}
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    to={`tel:${config?.phone}`}
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
                      {config?.phone}
                    </span>
                  </Link>
                </li>

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
                    {config?.address}
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              <span className="block sm:inline">Đã đăng ký bản quyền. </span>

              <a
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75"
                href="#"
              >
                Điều khoản & Điều kiện
              </a>

              <span>&middot;</span>

              <a
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75"
                href="#"
              >
                Chính sách riêng tư
              </a>
            </p>

            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
              &copy; 2024 w0wTeam - FPT Polytechnic Tay Nguyen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
