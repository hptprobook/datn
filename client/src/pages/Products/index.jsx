import { useParams } from 'react-router-dom';
import HeaderBC from '~/components/common/Breadcrumb/HeaderBC';
import ProductDetailSlider from './components/ProductDetailSlider';
import ProductDetailInfor from './components/ProductDetailInfor';
import ProductDetailReview from './components/ProductDetailReview';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getProductBySlug,
  increaseProductView,
  updateCurrentUser,
} from '~/APIs';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '~/context/UserContext';
import ProductItem from '~/components/common/Product/ProductItem';
import MainLoading from '~/components/common/Loading/MainLoading';

const MAX_VIEWS = 20;

const ProductPage = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { slug } = useParams();
  const { user } = useUser();
  const productsViewed = user ? user?.views : [];
  const favoriteProducts = user ? user?.favorites : [];

  const { data: productInfo, isLoading } = useQuery({
    queryKey: ['getProductBySlug', slug],
    queryFn: () => getProductBySlug(slug),
  });

  const { mutate: updateViews } = useMutation({
    mutationFn: (updatedViews) => updateCurrentUser({ views: updatedViews }),
  });

  const increaseView = useMutation({
    mutationFn: increaseProductView,
  });

  useEffect(() => {
    const viewTimeout = setTimeout(() => {
      increaseView.mutate({ slug });
    }, 3000);

    return () => clearTimeout(viewTimeout);
  }, [productInfo]);

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

  if (isLoading) return <MainLoading />;

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
      {!productInfo && (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">
            Sản phẩm không tồn tại, vui lòng quay lại sau
          </h1>
        </div>
      )}
      <Helmet>
        <title>BMT Life | {productInfo.name || 'Chi tiết sản phẩm'}</title>
        <meta
          name="description"
          content={
            productInfo?.seoOptions?.description ||
            'Website thời trang chuyên cung cấp quần áo, giày dép, túi xách, phụ kiện với chất lượng cao và giá cả phải chăng. Cập nhật xu hướng thời trang mới nhất.'
          }
        />
        <meta
          name="keywords"
          content={
            productInfo?.seoOptions?.alias ||
            'BMT Life, thời trang, quần áo, giày dép, túi xách, phụ kiện, mua sắm, thời trang nam nữ'
          }
        />
        <meta
          property="og:title"
          content={
            productInfo?.seoOptions?.title ||
            'BMT Life - Thời Trang Đẳng Cấp | Mua Sắm Dễ Dàng'
          }
        />
        <meta
          property="og:description"
          content={
            productInfo?.seoOptions?.description ||
            'Website thời trang chuyên cung cấp quần áo, giày dép, túi xách, phụ kiện với chất lượng cao và giá cả phải chăng. Cập nhật xu hướng thời trang mới nhất.'
          }
        />
      </Helmet>
      <HeaderBC title="Chi tiết sản phẩm" name={productInfo.name} />

      <div className="mb-24 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
      <div className="mt-10 text-gray-600 z-20">
        <div className="text-center lg:text-left font-extrabold">
          MÔ TẢ SẢN PHẨM
        </div>
        <div className="divider"></div>
        <div
          className="text-gray-700 mt-2 font-light px-4"
          dangerouslySetInnerHTML={{
            __html: isContentExpanded
              ? productInfo?.content
              : productInfo?.description,
          }}
        />

        <button
          className="btn bg-red-600 hover:bg-red-700 rounded-md text-white mt-4 mx-4"
          onClick={handleToggleContent}
        >
          {isContentExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      </div>

      <ProductDetailReview reviews={productInfo.reviews} />

      {user && (
        <>
          <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold uppercase">Sản phẩm đã xem</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {productsViewed.map((item) => (
                <div key={item._id} className="relative">
                  <ProductItem product={item} />
                </div>
              ))}
            </div>
          </div>
          <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold uppercase">Sản phẩm yêu thích</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {favoriteProducts.map((item) => (
                <div key={item._id} className="relative">
                  <ProductItem product={item} isWishList={true} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductPage;
