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
import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import MainLoading from '~/components/common/Loading/MainLoading';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const sort = searchParams.get('sort');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: { min: null, max: null },
  });
  const [sortOption, setSortOption] = useState(sort || '');
  const [shouldFetchFiltered, setShouldFetchFiltered] = useState(false);
  const [noMatchingProducts, setNoMatchingProducts] = useState(false);
  const [limit, setLimit] = useState(20);

  const { data: priceRangeData } = useQuery({
    queryKey: ['price-range'],
    queryFn: getMinMaxPrices,
    initialData: () => {
      return {
        minPrice: 1000,
        maxPrice: 2000000,
      };
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
    setShouldFetchFiltered(true);
  }, []);

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', keyword, limit],
    queryFn: () => searchProducts({ keyword, limit }),
    enabled: !!keyword, // Simplified condition
  });

  const updateUrlWithFilter = (filterParams) => {
    const params = new URLSearchParams(window.location.search);
    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] !== null) {
        params.set(key, filterParams[key]);
      } else {
        params.delete(key);
      }
    });
    window.history.replaceState(null, '', '?' + params.toString());
  };

  useEffect(() => {
    const filterParams = {
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max,
      colors: filters.colors.join(','),
      sizes: filters.sizes.join(','),
    };
    updateUrlWithFilter(filterParams);
  }, [filters]);

  useEffect(() => {
    setFilters({
      colors: [],
      sizes: [],
      priceRange: { min: null, max: null },
    });
    setSortOption('');
    setShouldFetchFiltered(false);
  }, [keyword, setFilters, setSortOption, setShouldFetchFiltered]); // Added dependencies

  const { data: filteredProductsData, isLoading: isFilteredDataLoading } =
    useQuery({
      queryKey: [
        'filtered-products-with-search',
        keyword,
        filters,
        sortOption,
        limit,
      ],
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
          return result;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setNoMatchingProducts(true);
            return null;
          }
          throw error;
        }
      },
      enabled:
        shouldFetchFiltered &&
        !!filters.priceRange.min &&
        !!filters.priceRange.max,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 60,
    });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setShouldFetchFiltered(true);
  }, []);

  const handlePriceRangeChange = useCallback((newPriceRange) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newPriceRange,
    }));
    setShouldFetchFiltered(true);
  }, []);

  const handleSortChange = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      setShouldFetchFiltered(true);
      navigate(`/tim-kiem?keyword=${keyword}&sort=${newSortOption}`);
    },
    [navigate, keyword]
  );

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
          {noMatchingProducts ? (
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
                shouldFetchFiltered
                  ? filteredProductsData
                  : searchResults?.products
              }
              isLoading={
                shouldFetchFiltered ? isFilteredDataLoading : searchLoading
              }
              keyword={keyword}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
              filters={filters}
              shouldFetchFiltered={shouldFetchFiltered}
            />
          )}
        </div>
      </div>
    </section>
  );
};

SearchPage.propTypes = {};

export default SearchPage;
