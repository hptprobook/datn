import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import CartListProduct from './components/CartListProduct';
import CartSummary from './components/CartSummary';
import { CartProvider } from '~/context/CartContext';

const CartPage = () => {
  return (
    <CartProvider>
      <section className="max-w-container mx-auto mt-16 relative z-10">
        <div className="w-full lg-6 relative z-10">
          <div className="flex justify-center mb-2 lg:mb-12">
            <CheckoutStepper currentStep={1} />
          </div>
          <div className="">
            <section className="bg-white antialiased">
              <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                  <CartListProduct />
                  <CartSummary />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </CartProvider>
  );
};

export default CartPage;
