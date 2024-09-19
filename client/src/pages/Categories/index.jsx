import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import CategorySidebar from './CategorySidebar';
import CategoryContent from './CategoryContent';
import { useQuery } from '@tanstack/react-query';
import { getCategoryBySlug, getAllProducts } from '~/APIs'; // Thêm API getAllProducts
import MainLoading from '~/components/common/Loading/MainLoading';
import { handleToast } from '~/customHooks/useToast';
import { useState } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [filters, setFilters] = useState({ colors: [], sizes: [] });

  // Gọi API getCategoryBySlug
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ['getCategoryBySlug', slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  // Gọi API getAllProducts
  const {
    data: allProductsData,
    error: productsError,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ['getAllProducts'],
    queryFn: getAllProducts,
  });

  if (categoryLoading || productsLoading) return <MainLoading />;

  if (categoryError) {
    handleToast('error', categoryError);
    return null;
  }

  if (productsError) {
    handleToast('error', productsError);
    return null;
  }

  // Hàm xử lý khi bộ lọc thay đổi
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC
        title={'Danh mục sản phẩm'}
        name={categoryData?.category?.name}
      />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <CategorySidebar
            category={categoryData?.category}
            products={allProductsData?.products} // Truyền sản phẩm vào Sidebar
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="col-span-4">
          <CategoryContent catData={categoryData?.category} filters={filters} />
        </div>
      </div>
    </section>
  );
}
