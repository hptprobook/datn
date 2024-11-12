import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import {
  findOrderByCodeAPI,
  updateOrderNotLoginAPI,
} from '~/APIs/Orders/notLoginOrder';
import { useMutation } from '@tanstack/react-query';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import { Link } from 'react-router-dom';
import {
  formatCurrencyVND,
  formatDateToDDMMYYYY,
  formatVietnamesePhoneNumber,
} from '~/utils/formatters';
import MainLoading from '~/components/common/Loading/MainLoading';

const TrackingOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [debounce, setDebounce] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: findOrderByCodeAPI,
    onSuccess: (data) => {
      setSearchedOrder(data);
      if (!data) {
        useSwal.fire({
          icon: 'error',
          title: 'Thất bại!',
          text: `Không tìm thấy đơn hàng với mã "${orderCode}", vui lòng kiểm tra lại`,
          confirmButtonText: 'Xác nhận',
        });
      }
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: 'Lỗi khi tìm kiếm đơn hàng, vui lòng thử lại',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderNotLoginAPI,
    onSuccess: (data) => {
      setSearchedOrder(data);
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng đã được hủy thành công.',
        confirmButtonText: 'Xác nhận',
      });
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: 'Không thể hủy đơn hàng, vui lòng thử lại.',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const handleCancelOrder = (e) => {
    e.preventDefault();
    useSwalWithConfirm
      .fire({
        icon: 'warning',
        title: 'Xác nhận hủy đơn hàng?',
        text: 'Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Hủy bỏ',
      })
      .then((result) => {
        if (result.isConfirmed) {
          cancelOrder({
            id: searchedOrder?._id,
            data: {
              status: {
                status: 'cancelled',
                note: 'Khách hàng huỷ đơn',
              },
            },
          });
        }
      });
  };

  if (isLoading || cancelOrderLoading) {
    return <MainLoading />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let formattedOrderCode = orderCode.trim();
    if (formattedOrderCode.startsWith('#')) {
      formattedOrderCode = formattedOrderCode.slice(1);
    }

    if (formattedOrderCode) {
      setDebounce(true);

      setTimeout(() => {
        setDebounce(false);
      }, 1500);

      mutate(formattedOrderCode);
    }
  };

  return (
    <section className='bg-white py-8 antialiased md:py-16'>
      <Helmet>
        <title>BMT Life | Theo dõi đơn hàng </title>
      </Helmet>
      <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center gap-4 mb-8'
        >
          <input
            type='text'
            className='w-full max-w-lg rounded-md border border-gray-300 p-3 text-sm bg-white text-gray-900'
            placeholder='Nhập mã đơn hàng được gửi trong gmail'
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
          />
          <button
            type='submit'
            className='btn rounded-md bg-red-500 hover:bg-red-700 text-white px-6 py-2'
            disabled={debounce}
          >
            Tìm kiếm đơn hàng
          </button>
        </form>

        {searchedOrder && (
          <>
            <h2 className='text-xl font-semibold text-gray-900 sm:text-2xl'>
              Theo dõi đơn hàng {orderCode}
            </h2>

            <div className='mt-6 sm:mt-8 lg:flex lg:gap-8'>
              <div className='w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 lg:max-w-xl xl:max-w-2xl'>
                {searchedOrder?.productsList?.map((product) => (
                  <>
                    <div className='space-y-4 p-6'>
                      <div className='flex items-center max-lg:gap-2 gap-6'>
                        <Link
                          to={`/san-pham/${product?.slug}`}
                          className='h-24 w-20'
                        >
                          <img
                            className='h-full w-full'
                            src={product?.image}
                            alt={product?.name}
                          />
                        </Link>
                        <Link
                          to={`/san-pham/${product?.slug}`}
                          className='flex-1 font-medium text-gray-900 hover:underline'
                        >
                          {product?.name}
                        </Link>
                        <p className='text-sm font-normal text-gray-900 max-lg:w-[80px]'>
                          <span className='font-medium text-gray-900'>
                            Loại:
                          </span>{' '}
                          <span className='text-indigo-700'>
                            {product?.variantColor}
                            {product?.variantSize !== 'FREESIZE' &&
                              ` - ${product.variantSize}`}
                          </span>
                        </p>
                      </div>
                      <div className='flex items-center justify-between gap-4'>
                        <div></div>
                        <div className='flex items-center justify-end gap-4'>
                          <p className='text-base font-normal text-gray-900'>
                            x{product?.quantity}
                          </p>
                          <p className='text-xl font-bold leading-tight text-red-600'>
                            {formatCurrencyVND(product?.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <div className='col-span-12 lg:col-span-4 space-y-6'>
                  <div className='p-6 rounded-lg bg-white'>
                    <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                      Thông tin đơn hàng
                    </h3>
                    <div className='space-y-4'>
                      {/* Tổng tiền hàng */}
                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Tổng tiền hàng:
                        </span>
                        <span className='col-span-8 text-red-600 font-bold text-lg text-right'>
                          {formatCurrencyVND(searchedOrder?.totalPrice)}
                        </span>
                      </div>

                      {/* Phí ship */}
                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Phí giao hàng:
                        </span>
                        <span className='col-span-8 text-orange-700 text-right'>
                          + {formatCurrencyVND(searchedOrder?.fee)}
                        </span>
                      </div>

                      {/* Giảm giá */}
                      {searchedOrder.discountPercentage && (
                        <div className='grid grid-cols-12'>
                          <span className='col-span-4 font-medium text-gray-700'>
                            Giảm giá:
                          </span>
                          <span className='col-span-8 text-green-600 text-right'>
                            - {formatCurrencyVND(searchedOrder.discountAmount)}
                          </span>
                        </div>
                      )}

                      {/* Phương thức thanh toán */}
                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Phương thức thanh toán:
                        </span>
                        <span className='col-span-8 text-gray-900 text-right'>
                          {searchedOrder?.paymentMethod}
                        </span>
                      </div>

                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Người nhận:
                        </span>
                        <span className='col-span-8 text-gray-900 font-bold text-right'>
                          {searchedOrder?.shippingInfo?.name} -{' '}
                          {formatVietnamesePhoneNumber(
                            searchedOrder?.shippingInfo?.phone
                          )}
                        </span>
                      </div>

                      {/* Địa chỉ giao hàng */}
                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Địa chỉ giao hàng:
                        </span>
                        <span className='col-span-8 text-gray-900 text-right'>
                          {searchedOrder?.shippingInfo?.fullAddress}
                        </span>
                      </div>

                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Ngày giao hàng dự kiến:
                        </span>
                        <span className='col-span-8 text-gray-900 text-right'>
                          {formatDateToDDMMYYYY(
                            searchedOrder?.estimatedDeliveryDate
                          )}
                        </span>
                      </div>

                      {/* Ghi chú */}
                      <div className='grid grid-cols-12'>
                        <span className='col-span-4 font-medium text-gray-700'>
                          Ghi chú:
                        </span>
                        <span className='col-span-8 text-gray-700 text-sm text-right'>
                          {searchedOrder?.shippingInfo?.note || 'Không'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6 grow sm:mt-8 lg:mt-0'>
                <div className='space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    Lịch sử đơn hàng
                  </h3>

                  <ol className='relative ms-3 border-s border-gray-200'>
                    {[...searchedOrder.status]
                      .reverse()
                      .map((status, index) => {
                        const isLastStatus = index === 0;
                        const isCancelled = status.status === 'cancelled';

                        return (
                          <li
                            key={index}
                            className={`mb-10 ms-6 ${
                              isLastStatus
                                ? isCancelled
                                  ? 'text-red-600'
                                  : 'text-blue-600'
                                : 'text-green-600'
                            }`}
                          >
                            <span
                              className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${
                                isLastStatus
                                  ? isCancelled
                                    ? 'bg-red-100'
                                    : 'bg-blue-100'
                                  : 'bg-green-100'
                              } ring-8 ring-white`}
                            >
                              {isLastStatus ? (
                                isCancelled ? (
                                  <Icon
                                    icon='mdi:close-circle-outline'
                                    className='h-4 w-4 text-red-600'
                                  />
                                ) : (
                                  <Icon
                                    icon='mdi:clock-outline'
                                    className='h-4 w-4 text-blue-600'
                                  />
                                )
                              ) : (
                                <Icon
                                  icon='mdi:checkbox-marked-circle-outline'
                                  className='h-4 w-4 text-green-600'
                                />
                              )}
                            </span>
                            <h4 className='mb-0.5 text-base font-semibold'>
                              {new Date(status.createdAt).toLocaleString()}
                            </h4>
                            <p className='text-sm'>{status.note}</p>
                          </li>
                        );
                      })}
                  </ol>

                  <div className='gap-4 sm:flex sm:items-center'>
                    <button
                      type='button'
                      className='w-full btn rounded-md bg-red-600 hover:bg-red-700 text-white'
                      disabled={
                        searchedOrder?.status[searchedOrder?.status.length - 1]
                          .status === 'cancelled'
                      }
                      onClick={handleCancelOrder}
                    >
                      Hủy đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TrackingOrderPage;
