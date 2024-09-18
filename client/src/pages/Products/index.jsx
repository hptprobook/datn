import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import ProductDetailSlider from './components/ProductDetailSlider';
import ProductDetailInfor from './components/ProductDetailInfor';
import ProductDetailReview from './components/ProductDetailReview';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '~/APIs';

export default function ProductPage() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['getProductById', slug],
    queryFn: () => getProductById(slug),
  });

  if (isLoading) return null;

  const productInfo = data && data.product;

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Chi tiết sản phẩm'} name={productInfo?.name} />

      <div className="mb-24 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ProductDetailSlider images={productInfo?.images} />
            <ProductDetailInfor product={productInfo} />
          </div>
        </div>
      </div>

      <div className="divider pt-20"></div>
      {/* Product Description */}
      <div className="lg:px-60 px-2 mt-10 text-gray-600">
        <div className="text-center lg:text-left font-extrabold">
          MÔ TẢ SẢN PHẨM
        </div>
        <div className="divider"></div>
        <div>{productInfo?.content}</div>
      </div>
      <ProductDetailReview />
    </section>
  );
}
