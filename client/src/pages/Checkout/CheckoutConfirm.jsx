import { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import MainLoading from '~/components/common/Loading/MainLoading';
import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';
import { formatCurrencyVND } from '~/utils/formatters';

const CheckoutConfirm = () => {
  const location = useLocation();
  const orderData = location.state?.orderData.data;
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) return <MainLoading />;

  return (
    <section className="py-24 relative max-w-container mx-auto">
      <div className="flex justify-center mb-12 pl-24">
        <CheckoutStepper currentStep={3} />
      </div>
      <div className="w-full px-4 md:px-5 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-11 text-center md:text-left">
          Bạn đã đặt hàng thành công
        </h2>
        <h6 className="font-medium text-xl leading-8 text-black mb-3">
          Xin chào, <b>{orderData?.shipping?.name}</b>
        </h6>
        <p className="font-normal text-lg leading-8 text-gray-500 mb-4">
          Đơn đặt hàng của bạn đã được hoàn thành và sẽ được giao chỉ từ 2 - 3
          ngày.
        </p>
        <p className="font-normal text-lg leading-8 text-gray-500 mb-8">
          Bạn có thể theo dõi đơn hàng tại{' '}
          <NavLink to={'#'} className={'text-red-500'}>
            Trang cá nhân
          </NavLink>{' '}
          hoặc{' '}
          <NavLink to={'#'} className={'text-red-500'}>
            Tra cứu đơn hàng
          </NavLink>{' '}
          dựa trên mã đơn hàng
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Ngày giao hàng dự kiến
            </p>
            <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">
              {orderData?.shipping?.estimatedDeliveryDate}
            </h6>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Mã đơn hàng
            </p>
            <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">
              {orderData?.orderCode}
            </h6>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Phương thức thanh toán
            </p>
            <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">
              {orderData?.paymentMethod}
            </h6>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Địa chỉ giao hàng
            </p>
            <h6 className="font-manrope text-md leading-9 text-black">
              {orderData?.shipping?.detailAddress}
            </h6>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
          <div className="col-span-5 md:col-span-5">
            <p className="font-normal text-md leading-8 text-gray-400">
              Sản phẩm
            </p>
          </div>
          <div className="col-span-6 md:col-span-7">
            <div className="grid grid-cols-5">
              <div className="col-span-3">
                <p className="font-normal text-md leading-8 text-gray-400 text-center">
                  Số lượng
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-normal text-md leading-8 text-gray-400 text-right">
                  Tổng tiền
                </p>
              </div>
            </div>
          </div>
        </div>
        {orderData?.productsList?.map((product, index) => (
          <div
            key={index}
            className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group"
          >
            <div className="w-full md:max-w-[126px]">
              <img
                src={product?.thumbnail}
                alt="product image"
                className="mx-auto"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 w-full">
              <div className="md:col-span-5">
                <div className="flex flex-col max-[500px]:items-center gap-3">
                  <NavLink to={'/'}>
                    <h6 className="font-semibold text-base leading-7 text-black hover:text-red-600 cursor-pointer">
                      {product?.name}
                    </h6>
                  </NavLink>
                  <h6 className="font-normal text-base leading-7 text-gray-500">
                    {product?.color} - {product?.size}
                  </h6>
                  <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-amber-600">
                    {formatCurrencyVND(product?.price)}
                  </h6>
                </div>
              </div>
              <div className="flex items-center h-full max-md:mt-3 md:col-span-3 justify-center text-gray-900">
                {product?.quantity}
              </div>
              <div className="flex items-center justify-center md:justify-end max-md:mt-3 h-full md:col-span-4">
                <div className="flex items-center flex-col">
                  <p className="font-bold text-md leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-amber-600">
                    {formatCurrencyVND(product?.price * product?.quantity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center sm:justify-end w-full my-6">
          <div className=" w-full">
            <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Tạm tính
              </p>
              <p className="font-semibold text-lg leading-8 text-gray-900">
                {formatCurrencyVND(
                  orderData?.productsList?.reduce(
                    (total, product) =>
                      total + product?.price * product?.quantity,
                    0
                  )
                )}
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Phí giao hàng
              </p>
              <p className="font-semibold text-lg leading-8 text-green-600">
                + {formatCurrencyVND(orderData?.shipping?.fee)}
              </p>
            </div>
            {/* <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Giảm giá
              </p>
              <p className="font-semibold text-lg leading-8 text-red-600">
                - {formatCurrencyVND(orderData?.discount)}
              </p>
            </div> */}
            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <p className="font-manrope font-semibold text-2xl leading-9 text-gray-900">
                Tổng tiền
              </p>
              <p className="font-manrope font-bold text-2xl leading-9 text-indigo-600">
                {formatCurrencyVND(orderData?.totalPrice)}
              </p>
            </div>
          </div>
        </div>
        <div className="data ">
          <p className="font-normal text-lg leading-8 text-gray-500 mb-11">
            Chúng tôi sẽ gửi email xác nhận vận chuyển khi các mặt hàng được vận
            chuyển thành công.
          </p>
          <h6 className="font-manrope font-bold text-2xl leading-9 text-black mb-3">
            Cảm ơn bạn đã mua sắm ở w0wStore <br className="md:hidden" />
            <NavLink
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to={'/'}
            >
              Tiếp tục mua sắm
              <span aria-hidden="true"> &rarr;</span>
            </NavLink>
          </h6>
        </div>
      </div>
    </section>
  );
};

CheckoutConfirm.propTypes = {};

export default CheckoutConfirm;
