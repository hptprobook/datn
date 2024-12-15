import { useParams, useSearchParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  filterProductsWithPriceRange,
  getCategoryBySlug,
  getMinMaxPrices,
  increaseCategoryView,
} from '~/APIs';
import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ProductListWithSort from '~/components/Products/ProductListWithSort';
import ProductListFilter from '~/components/Products/ProductListFilter';
import { Helmet } from 'react-helmet-async';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || '';
  const colors = searchParams.get('colors')
    ? searchParams.get('colors').split(',')
    : [];
  const sizes = searchParams.get('sizes')
    ? searchParams.get('sizes').split(',')
    : [];
  const minPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : null;
  const type = searchParams.get('type') || '';
  const tags = searchParams.get('tags')
    ? searchParams.get('tags').split(',')
    : [];

  const [filters, setFilters] = useState({
    colors,
    sizes,
    type,
    tags,
    priceRange: { min: minPrice, max: maxPrice },
  });
  const [sortOption, setSortOption] = useState(sort);
  const [limit, setLimit] = useState(20);
  const [noMatchingProducts, setNoMatchingProducts] = useState(false);

  const { data: priceRangeData } = useQuery({
    queryKey: ['price-range'],
    queryFn: getMinMaxPrices,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });

  const increaseView = useMutation({
    mutationFn: increaseCategoryView,
  });

  useEffect(() => {
    const viewTimeout = setTimeout(() => {
      increaseView.mutate({ slug });
    }, 3000);

    return () => clearTimeout(viewTimeout);
  }, [slug]);

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
      queryKey: [
        'filtered-products-category',
        slug,
        filters.colors,
        filters.sizes,
        filters.type,
        filters.tags,
        filters.priceRange.min,
        filters.priceRange.max,
        sortOption,
        limit,
      ],
      queryFn: async () => {
        try {
          const result = await filterProductsWithPriceRange({
            slug,
            minPrice: filters.priceRange.min,
            maxPrice: filters.priceRange.max,
            colors: filters.colors,
            sizes: filters.sizes,
            type: filters.type,
            tags: filters.tags,
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
      enabled: !!slug || hasActiveFilters(),
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
      keepPreviousData: true,
    });

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.colors.join(',') !== params.get('colors')) {
      if (newFilters.colors.length > 0)
        params.set('colors', newFilters.colors.join(','));
      else params.delete('colors');
    }

    if (newFilters.sizes.join(',') !== params.get('sizes')) {
      if (newFilters.sizes.length > 0)
        params.set('sizes', newFilters.sizes.join(','));
      else params.delete('sizes');
    }

    if (newFilters.tags.join(',') !== params.get('tags')) {
      if (newFilters.tags.length > 0)
        params.set('tags', newFilters.tags.join(','));
      else params.delete('tags');
    }

    if (newFilters.type !== params.get('type')) {
      if (newFilters.type) params.set('type', newFilters.type);
      else params.delete('type');
    }

    if (
      newFilters.priceRange.min !== null &&
      newFilters.priceRange.min !== Number(params.get('minPrice'))
    ) {
      params.set('minPrice', newFilters.priceRange.min);
    } else if (newFilters.priceRange.min === null) {
      params.delete('minPrice');
    }

    if (
      newFilters.priceRange.max !== null &&
      newFilters.priceRange.max !== Number(params.get('maxPrice'))
    ) {
      params.set('maxPrice', newFilters.priceRange.max);
    } else if (newFilters.priceRange.max === null) {
      params.delete('maxPrice');
    }

    if (sortOption !== params.get('sort')) {
      if (sortOption) params.set('sort', sortOption);
      else params.delete('sort');
    }

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  };

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        if (JSON.stringify(prevFilters) !== JSON.stringify(updatedFilters)) {
          updateSearchParams(updatedFilters);
        }
        return updatedFilters;
      });
      setNoMatchingProducts(false);
    },
    [sortOption, searchParams]
  );

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

  const handleSortChange = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      const params = new URLSearchParams(searchParams);
      params.set('sort', newSortOption);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 20);
  }, []);

  // Fetch category data
  const { data: categoryData } = useQuery({
    queryKey: ['getCategoryBySlug', slug],
    queryFn: () => getCategoryBySlug(slug),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return (
    <section className="max-w-container mx-auto max-lg:mt-0 mt-16 max-lg:px-4 max-lg:relative">
      <Helmet>
        <title>BMT Life | {categoryData?.name || 'Danh mục sản phẩm'}</title>
      </Helmet>
      <HeaderBC title={'Danh mục sản phẩm'} name={categoryData?.name} />
      <div className="divider"></div>
      <div className="grid max-lg:grid-cols-1 grid-cols-5 gap-6 mt-8">
        <div className="max-lg:col-span-1 col-span-1">
          <ProductListFilter
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            priceRangeData={priceRangeData}
            initialFilters={filters}
          />
        </div>
        <div className="max-lg:col-span-1 col-span-4">
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
              catData={categoryData}
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

CategoryPage.propTypes = {};

export default CategoryPage;
