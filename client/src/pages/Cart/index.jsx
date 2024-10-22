import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import CartListProduct from './components/CartListProduct';
import CartSummary from './components/CartSummary';
import { CartProvider } from '~/context/CartContext';
import { Helmet } from 'react-helmet-async';

const CartPage = () => {
  return (
    <CartProvider>
      <Helmet>
        <title>BMT Life | Giỏ hàng </title>
      </Helmet>
      <section className="max-w-container mx-auto mt-16 relative z-10">
        <div className="w-full relative z-10">
          <div className="flex justify-center mb-2 lg:mb-12">
            <CheckoutStepper currentStep={1} />
          </div>
          <div className="bg-white antialiased">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
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
        </div>
      </section>
    </CartProvider>
  );
};

export default CartPage;
