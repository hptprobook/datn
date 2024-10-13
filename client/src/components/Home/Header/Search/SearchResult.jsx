import { FaFire } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';
import './style.css';
import { useEffect } from 'react';

const SearchResult = ({
  handleModelClick,
  searchResults,
  searchLoading,
  closeModal,
  keyword,
  isOpen,
}) => {
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

  if (searchLoading || !searchResults || searchResults.length === 0) {
    return (
      <div
        className="w-full h-[620px] bg-yellow-50 flex justify-center items-center"
        onClick={handleModelClick}
      >
        <div className="search-loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-yellow-50 h-[620px]" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        <div className="flex gap-3 items-center py-6">
          <FaFire className="text-red-500" />
          <p className="font-bold">Tìm kiếm gợi ý</p>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-5">
          {searchResults &&
            searchResults.map((product) => (
              <NavLink
                to={`/san-pham/${product.slug}`}
                key={product._id}
                onClick={closeModal}
              >
                <ProductItem product={product} />
              </NavLink>
            ))}
        </div>
        <NavLink
          to={`/tim-kiem?keyword=${keyword}`}
          className="flex justify-end items-center gap-2 text-red-500 pb-6 font-medium"
          onClick={closeModal}
        >
          Xem tất cả <FaArrowRightLong />
        </NavLink>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  handleModelClick: PropTypes.func,
  searchResults: PropTypes.array.isRequired,
  searchLoading: PropTypes.bool, // Đảm bảo thêm prop này
};

export default SearchResult;
