import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import ProductDetailSlider from './components/ProductDetailSlider';
import ProductDetailInfor from './components/ProductDetailInfor';
import ProductDetailReview from './components/ProductDetailReview';

export default function ProductPage() {
  const { slug } = useParams();

  const images = [
    'https://pagedone.io/asset/uploads/1700472379.png',
    'https://pagedone.io/asset/uploads/1711622397.png',
    'https://pagedone.io/asset/uploads/1711622408.png',
    'https://pagedone.io/asset/uploads/1711622419.png',
    'https://pagedone.io/asset/uploads/1711622437.png',
  ];

  return (
    <section className="max-w-container mx-auto mt-16">
      <HeaderBC title={'Chi tiết sản phẩm'} slug={slug} />

      <div className="mb-24 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ProductDetailSlider images={images} />
            <ProductDetailInfor />
          </div>
        </div>
      </div>

      <div className="divider pt-20"></div>
      {/* Product Description */}
      <div className="px-60 mt-10">
        <div className="font-extrabold">MÔ TẢ SẢN PHẨM</div>
        <div className="divider"></div>
        <div>
          <p>THÀNH PHẦN</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            cupiditate nisi necessitatibus autem, dicta culpa aliquid. Est
            possimus, debitis velit, voluptate ipsa quia, totam ea optio dolore
            magnam esse earum.
          </p>
        </div>
      </div>
      <ProductDetailReview />
    </section>
  );
}
