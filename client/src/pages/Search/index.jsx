import { useSearchParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import { useQuery } from '@tanstack/react-query';
import { filterProductsWithSearch, getMinMaxPrices } from '~/APIs';
import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ProductListWithSort from '~/components/Products/ProductListWithSort';
import ProductListFilter from '~/components/Products/ProductListFilter';
import { Helmet } from 'react-helmet-async';

const SearchPage = () => {
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || '';

  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(sort);
  const [limit, setLimit] = useState(20);
  const [noMatchingProducts, setNoMatchingProducts] = useState(false);
  const [filters, setFilters] = useState({
    colors,
    sizes,
    priceRange: { min: minPrice, max: maxPrice },
  });

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

  // Query lấy giới hạn giá tiền sản phẩm
  const { data: priceRangeData } = useQuery({
    queryKey: ['price-range'],
    queryFn: getMinMaxPrices,
    initialData: { minPrice: 1000, maxPrice: 2000000 },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  // Query lấy kết quả lọc
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
      enabled: !!keyword || hasActiveFilters(),
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
      keepPreviousData: true,
    });

  // Những filter đang hoạt động
  const hasActiveFilters = useCallback(() => {
    return (
      filters.colors.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    );
  }, [filters]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          ...newFilters,
        };

        if (JSON.stringify(prevFilters) !== JSON.stringify(updatedFilters)) {
          updateSearchParams(updatedFilters);
        }

        return updatedFilters;
      });
      setNoMatchingProducts(false);
    },
    [sortOption, searchParams]
  );

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

  useEffect(() => {
    updateSearchParams(filters);
  }, [filters]);

  // Xử lý thay đổi sắp xếp
  const handleSortChange = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      const params = new URLSearchParams(searchParams);
      params.set('sort', newSortOption);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Xử lý thay đổi limit
  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
  }, []);

  if (!priceRangeData || !filteredProductsData) return null;

  // Thay đổi bộ lọc theo URL
  const updateSearchParams = (newFilters) => {
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

    setSearchParams(params);
  };

  return (
    <section className="max-w-container mx-auto mt-16">
      <Helmet>
        <title>BMT Life | Kết quả tìm kiếm: {keyword || ''}</title>
      </Helmet>
      <HeaderBC
        title={'Kết quả tìm kiếm'}
        name={keyword}
        url={'/tim-kiem?keyword='}
      />
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
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
