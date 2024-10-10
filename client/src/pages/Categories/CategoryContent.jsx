import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCatSlug, sortProductsByCatSlug } from '~/APIs';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryContent = ({
  catData,
  filteredProductsData,
  sortOption,
  onSortChange,
  setSortOption,
  onLoadMore,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const navigate = useNavigate();
  const { slug } = useParams();

  const { data: productsData, isFetching: isProductsFetching } = useQuery({
    queryKey: [
      'getProductsByCategorySlug',
      catData.slug,
      limit,
      filteredProductsData,
    ],
    queryFn: () => getProductsByCatSlug(catData.slug, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    enabled: !!filteredProductsData,
  });

  const {
    data: sortProductsData,
    isFetching: isSortProductsFetching,
    refetch: refetchSortedProducts,
  } = useQuery({
    queryKey: ['sortProductsByCatSlug', catData.slug, limit, key, value],
    queryFn: () =>
      sortProductsByCatSlug({ slug: catData.slug, limit, key, value }),
    enabled: !!key && !!value && sortOption !== '',
    staleTime: 5 * 60 * 1000,
  });

  const products =
    filteredProductsData ||
    (sortOption ? sortProductsData?.products : productsData) ||
    [];

  const isLoading = isProductsFetching || isSortProductsFetching;

  useEffect(() => {
    if (products?.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [products?.length, limit]);

  const debouncedRefetch = useCallback(
    () =>
      debounce(() => {
        refetchSortedProducts();
      }, 300),
    [refetchSortedProducts]
  );

  useEffect(() => {
    if (key && value) {
      debouncedRefetch();
    }
  }, [key, value, debouncedRefetch, filteredProductsData]);

  useEffect(() => {
    if (sortOption) {
      setSortOption(sortOption);
      const [newKey, newValue] = sortOption.split('-');
      setKey(newKey);
      setValue(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  if (isProductsFetching || isSortProductsFetching) return null;

  const handleLoadMore = () => {
    onLoadMore();
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    onSortChange(selectedValue);

    let newKey, newValue;

    switch (selectedValue) {
      case 'alphabet-az':
        newKey = 'alphabet';
        newValue = 'az';
        break;
      case 'alphabet-za':
        newKey = 'alphabet';
        newValue = 'za';
        break;
      case 'price-asc':
        newKey = 'price';
        newValue = 'asc';
        break;
      case 'price-desc':
        newKey = 'price';
        newValue = 'desc';
        break;
      case 'createdAt-newest':
        newKey = 'createdAt';
        newValue = 'newest';
        break;
      case 'createdAt-oldest':
        newKey = 'createdAt';
        newValue = 'oldest';
        break;
      default:
        newKey = '';
        newValue = '';
    }

    setKey(newKey);
    setValue(newValue);

    // Update the URL
    if (selectedValue) {
      navigate(`/danh-muc-san-pham/${slug}/${selectedValue}`);
    } else {
      navigate(`/danh-muc-san-pham/${slug}`);
    }
  };

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">{catData.name} - BMT Life</h2>
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
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductItem key={index} isLoading={true} />
              ))
            : products.map((product) => (
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
            disabled={isProductsFetching || isSortProductsFetching}
          >
            {isProductsFetching || isSortProductsFetching
              ? 'Đang tải...'
              : 'Xem thêm'}
            {!isProductsFetching && !isSortProductsFetching && (
              <Icon icon="mdi:arrow-right" className="ml-2" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

CategoryContent.propTypes = {
  catData: PropTypes.object,
  filteredProductsData: PropTypes.array,
  sortOption: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  setSortOption: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default CategoryContent;
