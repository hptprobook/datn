import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import SearchSidebar from './SearchSidebar';
import SearchContent from './SearchContent';
import { useQuery } from '@tanstack/react-query';
import {
  filterProductsWithSearch,
  getMinMaxPrices,
  searchProducts,
} from '~/APIs';
import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import MainLoading from '~/components/common/Loading/MainLoading';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const sort = searchParams.get('sort');
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: { min: null, max: null },
  });
  const [sortOption, setSortOption] = useState(sort || '');
  const [limit, setLimit] = useState(20);
  const [noMatchingProducts, setNoMatchingProducts] = useState(false);

  // Lấy khoảng giá cho bộ lọc giá
  const { data: priceRangeData } = useQuery({
    queryKey: ['price-range'],
    queryFn: getMinMaxPrices,
    initialData: { minPrice: 1000, maxPrice: 2000000 },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  // API tìm kiếm sản phẩm (theo từ khóa) khi không có bộ lọc nào
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', keyword, limit],
    queryFn: () => searchProducts({ keyword, limit }),
    enabled: !!keyword,
  });

  const hasActiveFilters = useCallback(() => {
    return (
      filters.colors.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    );
  }, [filters]);

  const { data: filteredProductsData, isLoading: isFilteredDataLoading } =
    useQuery({
      queryKey: ['filtered-products', keyword, filters, sortOption, limit],
      queryFn: async () => {
        try {
          const result = await filterProductsWithSearch({
            keyword,
            minPrice: filters.priceRange.min,
            maxPrice: filters.priceRange.max,
            colors: filters.colors,
            sizes: filters.sizes,
            sortOption,
            limit,
          });
          setNoMatchingProducts(false);
          if (result.length === 0) {
            setNoMatchingProducts(true);
            return [];
          }
          return result;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setNoMatchingProducts(true);
            return [];
          }
          throw error;
        }
      },
      enabled: !!keyword && hasActiveFilters(),
      staleTime: 10 * 1000,
      cacheTime: 1000 * 60 * 60,
    });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setNoMatchingProducts(false);
  }, []);

  // Xử lý khi thay đổi khoảng giá
  const handlePriceRangeChange = useCallback(
    (newPriceRange) => {
      if (
        filters.priceRange.min !== newPriceRange.min ||
        filters.priceRange.max !== newPriceRange.max
      ) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          priceRange: newPriceRange,
        }));
      }
    },
    [filters]
  );

  // Xử lý khi thay đổi sort
  const handleSortChange = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);

      const params = new URLSearchParams(searchParams);
      params.set('sort', newSortOption);

      if (filters.colors.length > 0)
        params.set('colors', filters.colors.join(','));
      if (filters.sizes.length > 0)
        params.set('sizes', filters.sizes.join(','));
      if (filters.priceRange.min)
        params.set('minPrice', filters.priceRange.min);
      if (filters.priceRange.max)
        params.set('maxPrice', filters.priceRange.max);

      navigate(`/tim-kiem?${params.toString()}`);
    },
    [navigate, searchParams, filters]
  );

  // Xử lý nút "Xem thêm"
  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
  }, []);

  if (searchLoading) return <MainLoading />;

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Kết quả tìm kiếm'} name={keyword} />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <SearchSidebar
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            priceRangeData={priceRangeData}
            initialFilters={filters}
          />
        </div>
        <div className="col-span-4">
          {noMatchingProducts || filteredProductsData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <Icon icon="tabler:news-off" className="text-6xl mb-4" />
              <p className="text-xl font-semibold mb-2">
                Không có sản phẩm nào phù hợp
              </p>
              <p className="text-sm">Vui lòng thử lại với các bộ lọc khác</p>
            </div>
          ) : (
            <SearchContent
              filteredProductsData={
                filteredProductsData || searchResults?.products
              }
              isLoading={isFilteredDataLoading || searchLoading}
              keyword={keyword}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
              filters={filters}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
