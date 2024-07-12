import { useState } from 'react';
import { menu } from '~/apis/mock_data';

export default function NavBar() {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  return (
    <div className="shadow-lg hidden lg:block bg-white">
      <div className="max-w-container mx-auto h-16 flex items-center">
        {menu.map((item) => (
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
                {item.list.map((subItem) => (
                  <div key={subItem.id} className="mb-4">
                    <p className="font-bold mb-4 text-sm">{subItem.title}</p>
                    <div className="">
                      {subItem.list.map((childItem) => (
                        <p
                          key={childItem.id}
                          className="mb-3 hover:text-red-500 cursor-pointer text-sm"
                        >
                          {childItem.title}
                        </p>
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
