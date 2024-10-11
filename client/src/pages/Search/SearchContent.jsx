import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';
import './style.css';
import MainLoading from '~/components/common/Loading/MainLoading';

const SearchContent = ({
  filteredProductsData,
  isLoading,
  keyword,
  sortOption,
  onSortChange,
  onLoadMore,
  limit,
}) => {
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (filteredProductsData?.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [filteredProductsData?.length, limit]);

  const handleLoadMore = (event) => {
    event.preventDefault();
    onLoadMore();
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    onSortChange(selectedValue);
  };

  if (isLoading || !filteredProductsData || filteredProductsData?.length === 0)
    return <MainLoading />;

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho &quot;{keyword}&quot;
      </h2>
      <div className="divider"></div>

      {/* Sorting Form */}
      <div className="mb-8 sticky top-0 bg-white z-20 py-4 shadow-sm">
        <form className="flex space-x-4 items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sắp xếp theo:
          </label>
          <select
            className="select select-bordered w-full max-w-xs select-sm bg-white text-black"
            onChange={handleSortChange}
            value={sortOption}
          >
            <option value="">Mặc định</option>
            <option value="createdAt-newest">Mới nhất</option>
            <option value="createdAt-oldest">Cũ nhất</option>
            <option value="alphabet-az">Tên (từ A - Z )</option>
            <option value="alphabet-za">Tên (từ Z - A )</option>
            <option value="price-asc">Giá (từ thấp - cao )</option>
            <option value="price-desc">Giá (từ cao - thấp )</option>
          </select>
        </form>
      </div>

      {/* Products Grid */}
      <div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3 lg:px-0">
          {filteredProductsData?.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="w-full flex justify-center mt-8">
        {hasMore && (
          <button
            className="btn btn-error bg-red-600"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Xem thêm'}
            {!isLoading && <Icon icon="mdi:arrow-right" className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
};

SearchContent.propTypes = {
  filteredProductsData: PropTypes.array,
  isLoading: PropTypes.bool,
  keyword: PropTypes.string.isRequired,
  sortOption: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  filters: PropTypes.object,
  page: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

export default SearchContent;
