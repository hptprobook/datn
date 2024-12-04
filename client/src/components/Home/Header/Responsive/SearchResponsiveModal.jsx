import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useWebConfig } from '~/context/WebsiteConfig';

const SearchResponsiveModal = ({ openSearch, setOpenSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [animateSearch, setAnimateSearch] = useState(false);
  const navigate = useNavigate();
  const { minMaxPrice } = useWebConfig();

  useEffect(() => {
    if (openSearch) {
      setAnimateSearch(true);
    } else {
      const timeout = setTimeout(() => setAnimateSearch(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [openSearch]);

  const handleSearchButtonClick = () => {
    const params = new URLSearchParams({
      keyword: searchValue?.trim() || '',
      minPrice: minMaxPrice?.minPrice ?? 0,
      maxPrice: minMaxPrice?.maxPrice ?? 0
    });
    
    navigate(`/tim-kiem?${params.toString()}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchButtonClick();
  };

  if (!animateSearch) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-transform duration-300 overflow-y-auto ${
        openSearch ? 'animate-slideIn' : 'animate-slideOut'
      }`}
    >
      <div className="bg-white w-full flex flex-col">
        <div className="bg-amber-600 w-full h-16 flex items-center px-4">
          <button
            type="button"
            className="text-2xl text-gray-50"
            onClick={() => setOpenSearch?.(false)}
            aria-label="Đóng tìm kiếm"
          >
            <FaArrowLeft />
          </button>
          <form onSubmit={handleSubmit} className="flex md:ml-7 ml-4 w-full">
            <input
              type="text"
              className="w-full md:w-search h-10 rounded-l-md outline-none pl-3 text-sm"
              placeholder="Tìm kiếm ..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearchButtonClick}
              className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
            >
              <IoIosSearch className="text-gray-50" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

SearchResponsiveModal.propTypes = {
  openSearch: PropTypes.bool,
  setOpenSearch: PropTypes.func,
};

export default SearchResponsiveModal;
