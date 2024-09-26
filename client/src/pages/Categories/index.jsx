import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import CategorySidebar from './CategorySidebar';
import CategoryContent from './CategoryContent';
import { useQuery } from '@tanstack/react-query';
import { getCategoryBySlug, getProductsByCatSlug } from '~/APIs'; // Thêm API getAllProducts
import MainLoading from '~/components/common/Loading/MainLoading';
import { handleToast } from '~/customHooks/useToast';
import { useState } from 'react';

const CategoryPage = () => {
  const { slug } = useParams();
  const [filters, setFilters] = useState({ colors: [], sizes: [] });

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
    queryKey: ['getProductsByCategorySlug'],
    queryFn: () => getProductsByCatSlug(slug),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  if (categoryLoading || productsLoading) return <MainLoading />;

  if (categoryError || productsError) {
    handleToast('error', categoryError || productsError);
    return null;
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
          />
        </div>
        <div className="col-span-4">
          <CategoryContent catData={categoryData} filters={filters} />
        </div>
      </div>
    </section>
  );
};

CategoryPage.propTypes = {};

export default CategoryPage;
