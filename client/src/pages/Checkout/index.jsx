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
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import { v4 as uuidv4 } from 'uuid';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useCart } from 'react-use-cart';
import LoggedOrder from './components/LoggedOrder';
import { Helmet } from 'react-helmet-async';
import { getVnpayUrlAPI, orderNotLoginApi } from '~/APIs';

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
      if (data?.data?.paymentMethod !== 'VNPAY') {
        useSwal
          .fire(
            'Thành công!',
            'Đơn hàng của bạn đã được đặt thành công',
            'success'
          )
          .then(() => {
            selectedProducts.forEach((product) => {
              removeItem(product.id);
            });
            navigate('/thanh-toan/xac-nhan', {
              state: { orderCode: data?.data?.orderCode },
            });
          });
      }
    },
    onError: () => {
      useSwal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại',
        'error'
      );
    },
  });

  // mutate lấy url vnpay
  const { mutate: getVnpayUrl, isLoading: isLoadingVnpayUrl } = useMutation({
    mutationFn: getVnpayUrlAPI,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      useSwal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra với phương thức thanh toán bằng VNPAY, vui lòng thử lại sau!',
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const handleConfirmCheckout = () => {
    useSwalWithConfirm
      .fire({
        icon: 'question',
        title: 'Xác nhân đặt hàng',
        text: 'Xác nhận đặt đơn hàng này? Hành động này sẽ không thể hoàn tác!',
        confirmButtonText: 'Xác nhân',
        cancelButtonText: 'Hủy bỏ',
      })
      .then((result) => {
        if (result.isConfirmed) {
          formik.handleSubmit();

          if (formik.isValid && formik.dirty) {
            const productsList = selectedProducts.map((product) => ({
              _id: product.productId || product._id,
              quantity: product.quantity,
              image: product.image,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              price: product.price,
              weight: product.weight,
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
              fullAddress: `${formik.values.address}, ${formik.values.ward_name}, ${formik.values.district_name}, ${formik.values.province_name}`,
            };

            const orderData = {
              orderCode: uuidv4().slice(0, 6).toUpperCase(),
              productsList: productsList,
              shippingInfo: shippingInfo,
              email: formik.values.email,
              totalPrice: productsList.reduce(
                (total, product) => total + product.itemTotal,
                0
              ),
              totalPayment:
                productsList.reduce(
                  (total, product) => total + product.itemTotal,
                  0
                ) + shippingFee,
              shippingType: 'cod',
              fee: shippingFee,
              paymentMethod: formik.values.paymentMethod,
            };

            if (orderData.paymentMethod === 'VNPAY') {
              submitOrder(orderData);
              getVnpayUrl({
                orderId: orderData.orderCode,
                amount: orderData.totalPayment,
              });
            } else {
              submitOrder(orderData);
            }
          }
        }
      });
  };

  if (isPending || isLoadingVnpayUrl) {
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
