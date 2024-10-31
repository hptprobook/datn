import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import ProductDetailSlider from './components/ProductDetailSlider';
import ProductDetailInfor from './components/ProductDetailInfor';
import ProductDetailReview from './components/ProductDetailReview';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductBySlug, updateCurrentUser } from '~/APIs';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { convertHTMLToText } from '~/utils/formatters';
import { useUser } from '~/context/UserContext';

const MAX_VIEWS = 20;

const ProductPage = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { slug } = useParams();
  const { user } = useUser();

  const { data: productInfo, isLoading } = useQuery({
    queryKey: ['getProductBySlug', slug],
    queryFn: () => getProductBySlug(slug),
  });

  const { mutate: updateViews } = useMutation({
    mutationFn: (updatedViews) => updateCurrentUser({ views: updatedViews }),
  });

  useEffect(() => {
    if (!productInfo || !user) return;

    const isViewed = user.views.some((item) => item._id === productInfo._id);
    if (isViewed) return;

    const viewTimeout = setTimeout(() => {
      const { _id, name, price, thumbnail, slug, reviews } = productInfo;

      const totalComment = reviews?.length || 0;
      const averageRating = totalComment
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalComment
        : 0;

      let updatedViews = [...user.views];

      if (updatedViews.length >= MAX_VIEWS) {
        updatedViews.shift();
      }

      updatedViews = [
        ...updatedViews,
        { _id, name, price, thumbnail, slug, totalComment, averageRating },
      ];

      updateViews(updatedViews);
    }, 3000);

    return () => clearTimeout(viewTimeout);
  }, [productInfo, user, updateViews]);

  if (isLoading || !productInfo) return null;

  const variantImages = productInfo.variants
    ?.map((variant) => variant.image)
    .filter((image) => image);

  const images = [...(productInfo.images || []), ...(variantImages || [])];

  const handleColorChange = (color) => {
    const selectedVariant = productInfo.variants.find(
      (variant) => variant.color === color
    );

    if (selectedVariant && selectedVariant.image) {
      const imageIndex = images.indexOf(selectedVariant.image);
      if (imageIndex !== -1) setActiveImageIndex(imageIndex);
    }
  };

  const handleToggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  return (
    <section className="max-w-container mx-auto mt-16">
      <Helmet>
        <title>BMT Life | {productInfo.name || 'Chi tiết sản phẩm'}</title>
      </Helmet>
      <HeaderBC title="Chi tiết sản phẩm" name={productInfo.name} />

      <div className="mb-24 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ProductDetailSlider
              images={images}
              activeIndex={activeImageIndex}
            />
            <ProductDetailInfor
              product={productInfo}
              onColorChange={handleColorChange}
            />
          </div>
        </div>
      </div>

      <div className="divider pt-20"></div>

      {/* Product Description */}
      <div className="lg:px-60 px-2 mt-10 text-gray-600 z-20">
        <div className="text-center lg:text-left font-extrabold">
          MÔ TẢ SẢN PHẨM
        </div>
        <div className="divider"></div>
        <div>
          {isContentExpanded
            ? convertHTMLToText(productInfo.content)
            : convertHTMLToText(productInfo.description)}
        </div>
        <button
          className="btn bg-red-600 hover:bg-red-700 rounded-md text-white mt-4"
          onClick={handleToggleContent}
        >
          {isContentExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      </div>

      <ProductDetailReview reviews={productInfo.reviews} />
    </section>
  );
};

export default ProductPage;
