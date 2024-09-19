import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import CartListProduct from './components/CartListProduct';
import CartSummary from './components/CartSummary';

export default function CartPage() {
  return (
    <section className="max-w-container mx-auto mt-16 relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
        <div className="flex justify-center mb-2  lg:mb-12 pl-24">
          <CheckoutStepper currentStep={1} />
        </div>
        <div className="grid grid-cols-12 mt-2 lg:mt-8">
          <CartListProduct />
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
