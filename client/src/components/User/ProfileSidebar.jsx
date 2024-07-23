import { IoBagCheckOutline } from 'react-icons/io5';
import { CiStar, CiUser } from 'react-icons/ci';
import { MdDiscount } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function ProfileSidebar() {
  return (
    <aside className="sidebar h-full justify-start z-0">
      <section className="sidebar-title items-center p-4">
        <div className="flex gap-5 items-center">
          <div className="avatar avatar-xl">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="avatar"
            />
          </div>

          <p className="text-md font-semibold">
            Xin chào, <br />
            Nguyen Van A
          </p>
        </div>
      </section>
      <section className="sidebar-content h-fit min-h-[20rem] overflow-visible">
        <nav className="menu rounded-md">
          <section className="menu-section px-4">
            <ul className="menu-items">
              <NavLink
                to={'/nguoi-dung'}
                end
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
              >
                <li className="flex gap-2 items-center">
                  <IoBagCheckOutline className="text-xl" />
                  <span className="font-semibold">Đơn hàng của tôi</span>
                </li>
              </NavLink>

              <li>
                <input type="checkbox" id="menu-1" className="menu-toggle" />
                <label className="menu-item justify-between" htmlFor="menu-1">
                  <div className="flex gap-2">
                    <CiUser className="text-xl" />
                    <span className="font-semibold">Tài khoản của tôi</span>
                  </div>

                  <span className="menu-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </label>

                <div className="menu-item-collapse">
                  <div className="min-h-0">
                    <NavLink
                      to={'/nguoi-dung/tai-khoan'}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? 'menu-item ml-6 menu-active'
                          : 'menu-item ml-6'
                      }
                    >
                      <label className="cursor-pointer">Hồ Sơ</label>
                    </NavLink>
                    <NavLink
                      to={'/nguoi-dung/tai-khoan/so-dia-chi'}
                      className={({ isActive }) =>
                        isActive
                          ? 'menu-item ml-6 menu-active'
                          : 'menu-item ml-6'
                      }
                    >
                      <label className="cursor-pointer">Sổ địa chỉ</label>
                    </NavLink>
                    <NavLink
                      to={'/nguoi-dung/tai-khoan/thong-bao'}
                      className={({ isActive }) =>
                        isActive
                          ? 'menu-item ml-6 menu-active'
                          : 'menu-item ml-6'
                      }
                    >
                      <label className="cursor-pointer">Thống báo</label>
                    </NavLink>
                    <NavLink
                      to={'/nguoi-dung/tai-khoan/doi-mat-khau'}
                      className={({ isActive }) =>
                        isActive
                          ? 'menu-item ml-6 menu-active'
                          : 'menu-item ml-6'
                      }
                    >
                      <label className="cursor-pointer">Đổi mật khẩu</label>
                    </NavLink>
                  </div>
                </div>
              </li>

              <NavLink
                to={'/nguoi-dung/kho-voucher'}
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
              >
                <li className="flex gap-2 items-center">
                  <MdDiscount className="text-xl" />
                  <span className="font-semibold">Kho voucher</span>
                </li>
              </NavLink>
              <NavLink
                to={'/nguoi-dung/danh-gia-cua-toi'}
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
              >
                <li className="flex gap-2 items-center">
                  <CiStar className="text-xl" />
                  <span className="font-semibold">Đánh giá của tôi</span>
                </li>
              </NavLink>
              <NavLink
                to={'/nguoi-dung/san-pham-da-xem'}
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
              >
                <li className="flex gap-2 items-center">
                  <FaRegEye className="text-xl" />
                  <span className="font-semibold">Sản phẩm đã xem</span>
                </li>
              </NavLink>
            </ul>
          </section>
        </nav>
      </section>
    </aside>
  );
}

export default ProfileSidebar;
