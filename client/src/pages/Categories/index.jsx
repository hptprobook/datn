import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import CategorySidebar from './CategorySidebar';
import CategoryContent from './CategoryContent';
import { useQuery } from '@tanstack/react-query';
import { getCategoryBySlug } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { handleToast } from '~/customHooks/useToast';

export default function CategoryPage() {
  const { slug } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ['getCategoryBySlug', slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  if (isLoading) return <MainLoading />;

  if (error) {
    handleToast('error', error);
    return null;
  }

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Danh mục sản phẩm'} name={data?.category?.name} />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <CategorySidebar />
        </div>
        <div className="col-span-4">
          <CategoryContent catData={data?.category} />
        </div>
      </div>
    </section>
  );
}
