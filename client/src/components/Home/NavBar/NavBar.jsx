import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllCategory } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { handleToast } from '~/customHooks/useToast';

export default function NavBar() {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategory,
  });

  if (isLoading) return <MainLoading />;

  if (error) {
    handleToast('error', error);
    return null;
  }

  const menuData = data?.menuHierarchy || [];

  if (menuData.length === 0) {
    return <p>No categories available</p>;
  }

  return (
    <div className="shadow-lg hidden lg:block bg-white">
      <div className="max-w-container mx-auto h-16 flex items-center">
        {menuData.map((item) => (
          <div
            key={item.id}
            className="relative group px-8 py-5 first:pl-0"
            onMouseEnter={() => setHoveredMenu(item.id)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <p className="cursor-pointer hover:text-red-500 font-semibold text-sm">
              {item.title}
            </p>
            {hoveredMenu === item.id && (
              <div className="fixed top-32 w-container left-1/2 -translate-x-1/2 bg-slate-50 shadow-lg z-10 p-4 border-t-df grid grid-cols-4 gap-5">
                {item.list?.map((subItem) => (
                  <div key={subItem.id} className="mb-4">
                    <p className="font-bold mb-4 text-sm">{subItem.title}</p>
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
