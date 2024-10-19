import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import DeliveryDetail from './components/DeliveryDetail';
import CheckoutInfo from './components/CheckoutInfo';
import useCheckAuth from '~/customHooks/useCheckAuth';

const CheckoutPage = () => {
  const { isAuthenticated } = useCheckAuth();
  return (
    <section className="bg-white py-8 antialiase md:py-16 max-w-container mx-auto">
      <form action="#" className="mx-auto px-4 2xl:px-0">
        <div className="flex justify-center mb-1 md:mb-12 pl-24">
          <CheckoutStepper currentStep={2} />
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <DeliveryDetail />
            <CheckoutInfo />
          </div>
        ) : (
          <div>Giao diện thanh toán đã đăng nhập</div>
        )}
      </form>
    </section>
  );
};

CheckoutPage.propTypes = {};

export default CheckoutPage;
