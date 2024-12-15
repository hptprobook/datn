import { FaFire } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Link, NavLink } from 'react-router-dom';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';
import './style.css';
import { useEffect } from 'react';
import { useWebConfig } from '~/context/WebsiteConfig';
import { Badge } from 'flowbite-react';
import { capitalizeFirstLetter } from '~/utils/formatters';

const SearchResult = ({
  handleModelClick,
  searchResults = [],
  searchLoading = false,
  closeModal,
  keyword = '',
  isOpen,
  suggestions = [],
}) => {
  const { minMaxPrice = { minPrice: 0, maxPrice: 0 } } = useWebConfig();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const showLoader =
    searchLoading ||
    !Array.isArray(searchResults) ||
    searchResults.length === 0;

  return (
    <div className="w-full bg-yellow-50 h-[720px]" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        {/* Đề xuất */}
        <div className="flex gap-3 items-center pt-6">
          <p className="font-bold">Đề xuất</p>
        </div>
        <div className="flex gap-3 items-center pt-6">
          {suggestions.map((text) => (
            <Link
              key={text}
              to={`/tim-kiem?keyword=${text || ''}&minPrice=${
                minMaxPrice?.minPrice
              }&maxPrice=${minMaxPrice?.maxPrice}`}
              onClick={closeModal}
            >
              <Badge color="light" className="cursor-pointer rounded-xs px-3">
                {capitalizeFirstLetter(text || '')}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Hiển thị loader hoặc kết quả tìm kiếm */}
        {showLoader ? (
          <div className="flex justify-center items-center py-10">
            <div className="search-loader"></div>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-center py-6">
              <FaFire className="text-red-500" />
              <p className="font-bold">Tìm kiếm gợi ý</p>
            </div>
            <div className="grid grid-cols-5 gap-6 pb-5">
              {searchResults.map((product) => (
                <NavLink
                  to={`/san-pham/${product?.slug || ''}`}
                  key={product?._id}
                  onClick={closeModal}
                >
                  <ProductItem product={product} />
                </NavLink>
              ))}
            </div>
            <NavLink
              to={`/tim-kiem?keyword=${encodeURIComponent(keyword)}`}
              className="flex justify-end items-center gap-2 text-red-500 pb-6 font-medium"
              onClick={closeModal}
            >
              Xem tất cả <FaArrowRightLong />
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  handleModelClick: PropTypes.func,
  searchResults: PropTypes.array,
  searchLoading: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  keyword: PropTypes.string,
  isOpen: PropTypes.bool,
};

export default SearchResult;
