import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import CategorySidebar from './CategorySidebar';
import CategoryContent from './CategoryContent';

export default function CategoryPage() {
  const { slug } = useParams();

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Danh mục sản phẩm'} slug={slug} />
      <div className="divider"></div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        <div className="col-span-1">
          <CategorySidebar />
        </div>
        <div className="col-span-4">
          <CategoryContent slug={slug} />
        </div>
      </div>
    </section>
  );
}
