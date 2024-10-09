import { FaFire } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';

const SearchResult = ({ handleModelClick, searchResults, searchLoading }) => {
  if (searchLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        Đang tìm kiếm
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-yellow-50" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        <div className="flex gap-3 items-center py-6">
          <FaFire className="text-red-500" />
          <p className="font-bold">Tìm kiếm gợi ý</p>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-5">
          {searchResults &&
            searchResults.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
        </div>
        <NavLink
          to={'#'}
          className="flex justify-end items-center gap-2 text-red-500 pb-6 font-medium"
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
