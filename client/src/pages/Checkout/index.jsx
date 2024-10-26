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
import { useSwal } from '~/customHooks/useSwal';
import { v4 as uuidv4 } from 'uuid';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useCart } from 'react-use-cart';
import LoggedOrder from './components/LoggedOrder';
import { Helmet } from 'react-helmet-async';
import { orderNotLoginApi } from '~/APIs';

const CheckoutPage = () => {
  return (
    <CheckoutProvider>
      <Helmet>
        <title>BMT Life | Thanh toán</title>
      </Helmet>
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
  const { removeItem } = useCart();

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
      selectedProducts.forEach((product) => {
        removeItem(product.id);
      });
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
        image: product.image,
        name: product.name,
        slug: product.slug,
        price: product.price,
        variantColor: product.variantColor,
        variantSize: product.variantSize,
        itemTotal: product.price * product.quantity,
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
    <section className="max-w-container mx-auto mt-8 relative z-10">
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
          <LoggedOrder selectedProducts={selectedProducts} />
        )}
      </form>
    </section>
  );
};

CheckoutPage.propTypes = {};

export default CheckoutPage;
