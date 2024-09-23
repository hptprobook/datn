import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getMenu } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { handleToast } from '~/customHooks/useToast';
import './style.css';

export default function NavBar() {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getMenu,
  });

  if (isLoading) return <MainLoading />;

  if (error) {
    handleToast('error', error);
    return null;
  }

  const menuData = data?.menu || [];

  if (menuData.length === 0) {
    return <p>Không có sẵn danh mục!</p>;
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
            <p className="cursor-pointer hover:text-red-500 font-semibold text-sm">
              {item.title}
            </p>
            {hoveredMenu === item.id && (
              <div className="fixed top-32 w-container left-1/2 -translate-x-1/2 bg-slate-50 shadow-lg z-10 p-4 border-t-df grid grid-cols-4 gap-5 menu-hovered">
                {item.list?.map((subItem) => (
                  <div key={subItem.id} className="mb-4">
                    <p className="font-bold mb-4 text-sm hover:text-red-600">
                      {subItem.title}
                    </p>
                    <div>
                      {subItem.list?.map((childItem) => (
                        <NavLink
                          key={childItem.id}
                          to={`/danh-muc-san-pham/${childItem.slug}`}
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
      </div>
    </div>
  );
}
