import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import CartListProduct from './components/CartListProduct';
import CartSummary from './components/CartSummary';
import { CartProvider } from '~/context/CartContext';
import { Helmet } from 'react-helmet-async';
import ProductItem from '~/components/common/Product/ProductItem';
import { useUser } from '~/context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getBestViewProduct } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';

const CartPage = () => {
  const { user } = useUser();
  const productsViewed = user ? user?.views : [];
  const favoriteProducts = user ? user?.favorites : [];

  const { data: bestViewProduct, isLoading } = useQuery({
    queryKey: ['getTopViewProduct'],
    queryFn: getBestViewProduct,
  });

  if (isLoading) return <MainLoading />;

  return (
    <CartProvider>
      <Helmet>
        <title>BMT Life | Giỏ hàng </title>
      </Helmet>
      <section className="max-w-container mx-auto mt-8 relative z-10">
        <div className="w-full relative z-10">
          <div className="flex justify-center mb-2 lg:mb-12">
            <CheckoutStepper currentStep={1} />
          </div>
          <div className="bg-white antialiased">
            <div
              className={`mx-auto max-w-screen-xl px-4 2xl:px-0 ${
                !user ? 'min-h-[60vh]' : ''
              }`}
            >
              <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                <div className="lg:w-2/3">
                  <CartListProduct />
                </div>
                <div className="mt-8 lg:mt-0 lg:w-1/3 lg:sticky lg:top-4 lg:self-start">
                  <CartSummary />
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8 px-4 lg:px-0">
            <h2 className="text-2xl font-bold uppercase">
              Sản phẩm được xem nhiều nhất
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {bestViewProduct?.map((item) => (
                <div key={item._id} className="relative">
                  <ProductItem product={item} isWishList={true} />
                </div>
              ))}
            </div>
          </div>

          {user && (
            <>
              <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8 px-4 lg:px-0">
                <h2 className="text-2xl font-bold uppercase">
                  Sản phẩm đã xem
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
                  {productsViewed.map((item) => (
                    <div key={item._id} className="relative">
                      <ProductItem product={item} isWishList={true} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8 px-4 lg:px-0">
                <h2 className="text-2xl font-bold uppercase">
                  Sản phẩm yêu thích
                </h2>
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
        </div>
      </section>
    </CartProvider>
  );
};

export default CartPage;
