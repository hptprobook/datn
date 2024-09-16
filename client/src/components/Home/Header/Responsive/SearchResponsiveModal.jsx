import { Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaFire } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { hotSearch, productSearchList } from '~/APIs/mock_data';

export default function SearchResponsiveModal({ openSearch, setOpenSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [animateSearch, setAnimateSearch] = useState(false);

  useEffect(() => {
    if (openSearch) {
      setAnimateSearch(true);
    } else {
      const timeout = setTimeout(() => setAnimateSearch(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [openSearch]);

  return (
    <div>
      {animateSearch && (
        <div
          className={`fixed inset-0 z-50 bg-white transition-transform duration-300 overflow-y-auto ${
            openSearch ? 'animate-slideIn' : 'animate-slideOut'
          }`}
        >
          <div className="bg-white w-full flex flex-col">
            <div className="bg-amber-600 w-full h-16 flex items-center px-4">
              <button
                className="text-2xl text-gray-50"
                onClick={() => setOpenSearch(false)}
              >
                <FaArrowLeft />
              </button>
              <form className="flex md:ml-7 ml-4 w-full">
                <input
                  type="text"
                  className="w-full md:w-search h-10 rounded-l-md outline-none pl-3 text-sm"
                  placeholder="Tìm kiếm ..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
                >
                  <IoIosSearch className="text-gray-50" />
                </button>
              </form>
            </div>
            <div className="flex-grow">
              {searchValue === '' ? (
                <div className="px-5">
                  <div className="flex gap-3 items-center pt-6">
                    <FaFire className="text-red-500" />
                    <p className="font-bold">Tìm kiếm phổ biến nhất</p>
                  </div>
                  <div className="flex gap-3 items-center mt-3 overflow-x-auto">
                    {hotSearch.map((item, index) => (
                      <Badge
                        key={index}
                        color="light"
                        className="cursor-pointer rounded-xs px-3"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-5">
                  <div className="flex gap-3 items-center py-6">
                    <FaFire className="text-red-500" />
                    <p className="font-bold">Tìm kiếm gợi ý</p>
                  </div>
                  <div className="mt-4">
                    {productSearchList.map((product) => (
                      <div key={product.id} className="mb-2 flex">
                        <NavLink to={'#'}>
                          <div className="w-20 h-30 mr-3 relative">
                            <div className="flex gap-2 absolute top-0 justify-center bg-red-500 w-full rounded-md text-xs text-white">
                              {product.label[0]}
                            </div>
                            <img
                              src={product.img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </NavLink>
                        <div className="mt-3">
                          <NavLink to={'#'} className="text-md font-semibold">
                            {product.title}
                          </NavLink>
                          <p className="text-md mt-2 text-red-500 font-bold">
                            {new Intl.NumberFormat('de-DE', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
