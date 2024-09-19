import { useState } from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import { CiStar, CiUser } from 'react-icons/ci';
import { MdDiscount } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { GrClose } from 'react-icons/gr';

function ProfileSidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      {/* Header */}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full md:h-auto w-full md:w-auto bg-white z-10 p-4 md:p-0 transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 bg-gray-200 rounded-full z-10"
          onClick={toggleSidebar}
        >
          <GrClose className="text-xl" />
        </button>

        <section className="sidebar-title items-center p-4 md:p-6 hidden md:flex text-black">
          <div className="flex gap-5 items-center">
            <div className="avatar avatar-xl">
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                alt="avatar"
                className="rounded-full"
              />
            </div>
            <p className="text-md font-semibold">
              Xin chào, <br />
              Nguyen Van A
            </p>
          </div>
        </section>
        <section className="sidebar-content h-fit min-h-[20rem] overflow-visible text-black">
          <nav className="menu rounded-md">
            <section className="menu-section px-4 text-black">
              <ul className="menu-items pt-24 md:pt-0">
                <NavLink
                  to={'/nguoi-dung'}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? 'menu-item menu-active bg-red-500 text-white'
                      : 'menu-item bg-white text-black hover:bg-red-500 hover:text-white'
                  }
                  onClick={handleMenuItemClick}
                >
                  <li className="flex gap-2 items-center">
                    <IoBagCheckOutline className="text-xl" />
                    <span className="font-semibold">Đơn hàng của tôi</span>
                  </li>
                </NavLink>
                <li>
                  <input type="checkbox" id="menu-1" className="menu-toggle" />
                  <label
                    className="menu-item justify-between bg-white text-black hover:bg-red-500 hover:text-white"
                    htmlFor="menu-1"
                  >
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
                  <div className="menu-item-collapse mt-2">
                    <div className="min-h-0 space-y-2">
                      <NavLink
                        to={'/nguoi-dung/tai-khoan'}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active bg-red-500 text-white'
                            : 'menu-item ml-6 bg-white text-black hover:bg-red-500 hover:text-white'
                        }
                        onClick={handleMenuItemClick}
                      >
                        <label className="cursor-pointer">Hồ Sơ</label>
                      </NavLink>
                      <NavLink
                        to={'/nguoi-dung/tai-khoan/so-dia-chi'}
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active bg-red-500 text-white'
                            : 'menu-item ml-6 bg-white text-black hover:bg-red-500 hover:text-white'
                        }
                        onClick={handleMenuItemClick}
                      >
                        <label className="cursor-pointer">Sổ địa chỉ</label>
                      </NavLink>
                      <NavLink
                        to={'/nguoi-dung/tai-khoan/thong-bao'}
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active bg-red-500 text-white'
                            : 'menu-item ml-6 bg-white text-black hover:bg-red-500 hover:text-white'
                        }
                        onClick={handleMenuItemClick}
                      >
                        <label className="cursor-pointer">Thống báo</label>
                      </NavLink>
                      <NavLink
                        to={'/nguoi-dung/tai-khoan/doi-mat-khau'}
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active bg-red-500 text-white'
                            : 'menu-item ml-6 bg-white text-black hover:bg-red-500 hover:text-white'
                        }
                        onClick={handleMenuItemClick}
                      >
                        <label className="cursor-pointer">Đổi mật khẩu</label>
                      </NavLink>
                    </div>
                  </div>
                </li>
                <NavLink
                  to={'/nguoi-dung/kho-voucher'}
                  className={({ isActive }) =>
                    isActive
                      ? 'menu-item menu-active bg-red-500 text-white'
                      : 'menu-item bg-white text-black hover:bg-red-500 hover:text-white'
                  }
                  onClick={handleMenuItemClick}
                >
                  <li className="flex gap-2 items-center">
                    <MdDiscount className="text-xl" />
                    <span className="font-semibold">Kho voucher</span>
                  </li>
                </NavLink>
                <NavLink
                  to={'/nguoi-dung/danh-gia-cua-toi'}
                  className={({ isActive }) =>
                    isActive
                      ? 'menu-item menu-active bg-red-500 text-white'
                      : 'menu-item bg-white text-black hover:bg-red-500 hover:text-white'
                  }
                  onClick={handleMenuItemClick}
                >
                  <li className="flex gap-2 items-center">
                    <CiStar className="text-xl" />
                    <span className="font-semibold">Đánh giá của tôi</span>
                  </li>
                </NavLink>
                <NavLink
                  to={'/nguoi-dung/san-pham-da-xem'}
                  className={({ isActive }) =>
                    isActive
                      ? 'menu-item menu-active bg-red-500 text-white'
                      : 'menu-item bg-white text-black hover:bg-red-500 hover:text-white'
                  }
                  onClick={handleMenuItemClick}
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
    </div>
  );
}

export default ProfileSidebar;
