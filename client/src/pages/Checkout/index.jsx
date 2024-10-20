import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import DeliveryDetail from './components/DeliveryDetail';
import CheckoutInfo from './components/CheckoutInfo';
import useCheckAuth from '~/customHooks/useCheckAuth';
import {
  CheckoutProvider,
  useCheckoutContext,
} from '~/context/CheckoutContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { orderNotLoginApi } from '~/APIs/Orders/notLoginOrder';
import { useSwal } from '~/customHooks/useSwal';
import { v4 as uuidv4 } from 'uuid';
import MainLoading from '~/components/common/Loading/MainLoading';

const CheckoutPage = () => {
  return (
    <CheckoutProvider>
      <CheckoutUI />
    </CheckoutProvider>
  );
};

const CheckoutUI = () => {
  const { isAuthenticated } = useCheckAuth();
  const { formik } = useCheckoutContext();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate(-1);
    }
  }, [selectedProducts, navigate]);

  const {
    mutate: submitOrder,
    isLoading,
    isPending,
  } = useMutation({
    mutationFn: orderNotLoginApi,
    onSuccess: (data) => {
      useSwal.fire(
        'Thành công!',
        'Đơn hàng của bạn đã được đặt thành công',
        'success'
      );
      navigate('/thanh-toan/xac-nhan', { state: { orderData: data } });
    },
    onError: () => {
      useSwal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại',
        'error'
      );
    },
  });

  const handleConfirmCheckout = () => {
    formik.handleSubmit();

    if (formik.isValid && formik.dirty) {
      const productsList = selectedProducts.map((product) => ({
        _id: product.productId,
        quantity: product.quantity,
        thumbnail: product.image,
        name: product.name,
        price: product.price,
        color: product.variantColor,
        size: product.variantSize,
        totalPrice: product.price * product.quantity,
      }));

      const shippingInfo = {
        provinceName: formik.values.province_name,
        districtName: formik.values.district_name,
        districtCode: formik.values.district_id,
        wardName: formik.values.ward_name,
        wardCode: formik.values.ward_id,
        detailAddress: formik.values.address,
        phone: formik.values.phone,
        name: formik.values.name,
        note: formik.values.note || '',
      };

      const orderData = {
        orderCode: uuidv4().slice(0, 6).toUpperCase(),
        productsList: productsList,
        shippingInfo: shippingInfo,
        email: formik.values.email,
        totalPrice:
          productsList.reduce(
            (total, product) => total + product.totalPrice,
            0
          ) + shippingFee,
        shipping: {
          name: formik.values.name,
          shippingType: formik.values.payment,
          fee: shippingFee,
          detailAddress: `${formik.values.address}, ${formik.values.ward_name}, ${formik.values.district_name}, ${formik.values.province_name}`,
          estimatedDeliveryDate: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
          phone: formik.values.phone,
        },
      };

      submitOrder(orderData);
    }
  };

  if (isPending) {
    return <MainLoading />;
  }

  return (
    <section className="bg-white py-8 antialiase md:py-16 max-w-container mx-auto">
      <form onSubmit={formik.handleSubmit} className="mx-auto px-4 2xl:px-0">
        <div className="flex justify-center mb-1 md:mb-12 pl-24">
          <CheckoutStepper currentStep={2} />
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <DeliveryDetail
              selectedProducts={selectedProducts}
              setShippingFee={setShippingFee}
            />
            <CheckoutInfo
              selectedProducts={selectedProducts}
              shippingFee={shippingFee}
              handleConfirmCheckout={handleConfirmCheckout}
              isLoading={isLoading}
            />
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
