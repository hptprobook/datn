import { useSearchParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import { useQuery } from '@tanstack/react-query';
import { getMinMaxPrices } from '~/APIs';
import { useState, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import ProductListWithSort from '~/components/Products/ProductListWithSort';
import ProductListFilter from '~/components/Products/ProductListFilter';
import { Helmet } from 'react-helmet-async';
import { searchProducts } from '~/APIs/ProductList/search';
import MainLoading from '~/components/common/Loading/MainLoading';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || '';

  const [sortOption, setSortOption] = useState(sort);
  const [limit, setLimit] = useState(20);
  const [noMatchingProducts, setNoMatchingProducts] = useState(false);

  // filter màu sắc
  const colors = searchParams.get('colors')
    ? searchParams.get('colors').split(',')
    : [];

  // filter kích thước
  const sizes = searchParams.get('sizes')
    ? searchParams.get('sizes').split(',')
    : [];

  // giá nhỏ nhất
  const minPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : null;

  // giá lớn nhất
  const maxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : null;

  const [filters, setFilters] = useState({
    colors,
    sizes,
    priceRange: { min: minPrice, max: maxPrice },
    tags: searchParams.get('tags') ? searchParams.get('tags').split(',') : [],
    type: searchParams.get('type') || '',
  });

  // Query lấy giới hạn giá tiền sản phẩm
  const { data: priceRangeData } = useQuery({
    queryKey: ['price-range'],
    queryFn: getMinMaxPrices,
    initialData: { minPrice: 1000, maxPrice: 2000000 },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  // 1. Memoize hasActiveFilters result
  const activeFilters = useMemo(() => {
    return (
      filters.colors.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    );
  }, [filters]);

  const queryKey = useMemo(
    () => [
      'searchProducts',
      keyword,
      JSON.stringify(filters),
      sortOption,
      limit,
    ],
    [keyword, filters, sortOption, limit]
  );

  // Query lấy kết quả lọc
  const { data: filteredProductsData, isLoading: isFilteredDataLoading } =
    useQuery({
      queryKey,
      queryFn: async () => {
        try {
          const result = await searchProducts({
            keyword,
            limit,
            minPrice: filters.priceRange.min,
            maxPrice: filters.priceRange.max,
            colors: filters.colors,
            sizes: filters.sizes,
            sort: sortOption,
          });

          if (!result?.data?.products?.length) {
            setNoMatchingProducts(true);
            return [];
          }
          return result.data.products;
        } catch (error) {
          if (error.response?.status === 404) {
            setNoMatchingProducts(true);
            return [];
          }
          throw error;
        }
      },
      enabled: !!keyword || activeFilters,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,
        tags: newFilters.tags || prevFilters.tags || [],
        type: newFilters.type || prevFilters.type || '',
      };

      if (JSON.stringify(prevFilters) !== JSON.stringify(updatedFilters)) {
        updateSearchParams(updatedFilters);
      }

      return updatedFilters;
    });
    setNoMatchingProducts(false);
  }, []);

  // Xử lý thay đổi giới hạn tiền
  const handlePriceRangeChange = useCallback(
    (newPriceRange) => {
      if (
        filters.priceRange.min !== newPriceRange.min ||
        filters.priceRange.max !== newPriceRange.max
      ) {
        const updatedFilters = {
          ...filters,
          priceRange: newPriceRange,
        };
        setFilters(updatedFilters);
        updateSearchParams(updatedFilters);
      }
    },
    [filters]
  );

  // Thay đổi bộ lọc theo URL
  const updateSearchParams = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);

      if (newFilters.colors.length > 0)
        params.set('colors', newFilters.colors.join(','));
      else params.delete('colors');

      if (newFilters.sizes.length > 0)
        params.set('sizes', newFilters.sizes.join(','));
      else params.delete('sizes');

      if (newFilters.priceRange.min !== null)
        params.set('minPrice', newFilters.priceRange.min);
      else params.delete('minPrice');

      if (newFilters.priceRange.max !== null)
        params.set('maxPrice', newFilters.priceRange.max);
      else params.delete('maxPrice');

      if (sortOption) params.set('sort', sortOption);
      else params.delete('sort');

      if (newFilters.tags?.length > 0)
        params.set('tags', newFilters.tags.join(','));
      else params.delete('tags');

      if (newFilters.type) params.set('type', newFilters.type);
      else params.delete('type');

      setSearchParams(params);
    },
    [searchParams, setSearchParams, sortOption]
  );

  // Xử lý thay đổi sắp xếp
  const handleSortChange = useCallback(
    (newSortOption) => {
      if (newSortOption === sortOption) return;
      setSortOption(newSortOption);
      const params = new URLSearchParams(searchParams);
      params.set('sort', newSortOption);
      setSearchParams(params);
    },
    [searchParams, setSearchParams, sortOption]
  );

  // Xử lý thay đổi limit
  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
  }, []);

  if (!priceRangeData) return <MainLoading />;

  return (
    <section className="max-w-container mx-auto mt-16">
      <Helmet>
        <title>BMT Life | Kết quả tìm kiếm: {keyword || ''}</title>
      </Helmet>
      <HeaderBC title={'Kết quả tìm kiếm'} name={keyword} />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <ProductListFilter
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
            <ProductListWithSort
              keyword={keyword}
              filters={filters}
              filteredProductsData={filteredProductsData}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
              isLoading={isFilteredDataLoading}
              limit={limit}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
