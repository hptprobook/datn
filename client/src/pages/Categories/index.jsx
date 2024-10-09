import { useParams, useNavigate } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import CategorySidebar from './CategorySidebar';
import CategoryContent from './CategoryContent';
import { useQuery } from '@tanstack/react-query';
import {
  filterProductsWithPriceRange,
  getCategoryBySlug,
  getMinMaxPrices,
  getProductsByCatSlug,
} from '~/APIs';
import { handleToast } from '~/customHooks/useToast';
import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CategoryPage = () => {
  const { slug, sort } = useParams();
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
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  const { data: filteredProductsData, refetch: refetchFilteredProducts } =
    useQuery({
      queryKey: ['filtered-products', slug, filters, sortOption, limit],
      queryFn: async () => {
        if (
          !slug ||
          filters.priceRange.min === undefined ||
          filters.priceRange.max === undefined ||
          !shouldFetchFiltered
        ) {
          return Promise.resolve(null);
        }
        try {
          const result = await filterProductsWithPriceRange({
            slug,
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
      enabled: shouldFetchFiltered,
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
      navigate(`/danh-muc-san-pham/${slug}/${newSortOption}`);
    },
    [navigate, slug]
  );

  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
    setShouldFetchFiltered(true);
  }, []);

  useEffect(() => {
    if (shouldFetchFiltered) {
      refetchFilteredProducts();
    }
  }, [filters, sortOption, refetchFilteredProducts, shouldFetchFiltered]);

  // Fetch category data
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ['getCategoryBySlug', slug],
    queryFn: () => getCategoryBySlug(slug),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // Fetch all products
  const {
    data: allProductsData,
    error: productsError,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ['getProductsByCategorySlug', slug],
    queryFn: () => getProductsByCatSlug(slug),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  if (categoryLoading || productsLoading) return null;

  if (categoryError || productsError) {
    handleToast('error', categoryError || productsError);
    return null;
  }

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Danh mục sản phẩm'} name={categoryData?.name} />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <CategorySidebar
            category={categoryData}
            products={allProductsData}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            priceRangeData={priceRangeData}
            filters={filters}
            initialFilters={filters}
            noMatchingProducts={noMatchingProducts}
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
            <CategoryContent
              catData={categoryData}
              filters={filters}
              filteredProductsData={
                shouldFetchFiltered ? filteredProductsData : allProductsData
              }
              sortOption={sortOption}
              setSortOption={setSortOption}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </section>
  );
};

CategoryPage.propTypes = {};

export default CategoryPage;
