import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getMenu } from '~/APIs';
import { handleToast } from '~/customHooks/useToast';
import './style.css';
import { useWebConfig } from '~/context/WebsiteConfig';

const NavBar = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const location = useLocation();

  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getMenu,
  });

  const { minMaxPrice } = useWebConfig();

  if (error) {
    handleToast('error', error);
    return null;
  }

  if (isLoading || !data?.menu?.length) {
    return null;
  }

  const menuData = data.menu;

  const SimpleNavBar = ({ title }) => (
    <div className="hidden lg:block bg-white text-red-600">
      <div className="max-w-container mx-auto h-16 flex gap-6 items-center text-xl">
        <span>BMT Life</span> <span>|</span> <span>{title}</span>
      </div>
    </div>
  );

  const specialRoutes = {
    '/gio-hang': 'Giỏ hàng',
    '/thanh-toan': 'Thanh toán',
    '/thanh-toan/xac-nhan': 'Đặt hàng thành công',
  };

  if (specialRoutes[location.pathname]) {
    return <SimpleNavBar title={specialRoutes[location.pathname]} />;
  }

  if (location.pathname === '/gio-hang') {
    return (
      <div className="hidden lg:block bg-white text-red-600">
        <div className="max-w-container mx-auto h-16 flex gap-6 items-center text-xl">
          <span>BMT Life</span> <span>|</span> <span>Giỏ hàng</span>
        </div>
      </div>
    );
  }

  if (location.pathname === '/thanh-toan') {
    return (
      <div className="hidden lg:block bg-white text-red-600">
        <div className="max-w-container mx-auto h-16 flex gap-6 items-center text-xl">
          <span>BMT Life</span> <span>|</span> <span>Thanh toán</span>
        </div>
      </div>
    );
  }

  if (location.pathname === '/thanh-toan/xac-nhan') {
    return (
      <div className="hidden lg:block bg-white text-red-600">
        <div className="max-w-container mx-auto h-16 flex gap-6 items-center text-xl">
          <span>BMT Life</span> <span>|</span> <span>Đặt hàng thành công</span>
        </div>
      </div>
    );
  }

  if (isLoading || menuData.length === 0) {
    return (
      <div className="menu-loader h-16 w-full bg-white flex items-center justify-center"></div>
    );
  }

  return (
    <div className="shadow-lg hidden lg:block bg-white text-black">
      <div className="max-w-container mx-auto h-16 flex items-center">
        {menuData.map((item) => (
          <div
            key={item.id}
            className="relative group px-8 py-5 first:pl-0 navbar__menu--item"
            onMouseEnter={() => setHoveredMenu(item.id)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <NavLink
              to={`/danh-muc-san-pham/${item.slug}?minPrice=${
                minMaxPrice?.minPrice || 0
              }&maxPrice=${minMaxPrice?.maxPrice || 5000000}`}
              end
            >
              <p className="cursor-pointer hover:text-red-500 font-semibold text-sm">
                {item.title}
              </p>
            </NavLink>
            {hoveredMenu === item.id && (
              <div className="fixed top-36 w-container left-1/2 -translate-x-1/2 bg-slate-50 shadow-lg z-10 p-4 border-t-df grid grid-cols-4 gap-5 menu-hovered">
                {item.list?.map((subItem) => (
                  <div key={subItem.id} className="mb-4">
                    <NavLink
                      to={`/danh-muc-san-pham/${subItem?.slug}?minPrice=${
                        minMaxPrice?.minPrice || 0
                      }&maxPrice=${minMaxPrice?.maxPrice || 5000000}`}
                      end
                    >
                      <p className="font-bold mb-4 text-sm hover:text-red-600">
                        {subItem.title}
                      </p>
                    </NavLink>
                    <div>
                      {subItem.list?.map((childItem) => (
                        <NavLink
                          key={childItem.id}
                          to={`/danh-muc-san-pham/${childItem.slug}?minPrice=${
                            minMaxPrice?.minPrice || 0
                          }&maxPrice=${minMaxPrice?.maxPrice || 5000000}`}
                          end
                        >
                          <p className="mb-3 hover:text-red-500 cursor-pointer text-sm">
                            {childItem.title}
                          </p>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <NavLink
          to={'/tin-tuc'}
          end
          className="hover:text-red-500 font-semibold text-sm px-8"
        >
          Tin tức
        </NavLink>
      </div>
    </div>
  );
};

NavBar.propTypes = {};

export default NavBar;
