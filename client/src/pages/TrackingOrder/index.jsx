import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import {
  findOrderByCodeAPI,
  updateOrderNotLoginAPI,
} from '~/APIs/Orders/notLoginOrder';
import { useMutation } from '@tanstack/react-query';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import { Link, useNavigate } from 'react-router-dom';
import {
  formatCurrencyVND,
  formatDateToDDMMYYYY,
  formatVietnamesePhoneNumber,
} from '~/utils/formatters';
import MainLoading from '~/components/common/Loading/MainLoading';
import Swal from 'sweetalert2';
import {
  reasonsForCancel,
  reasonsForReturn,
  returnStatus,
} from '../User/Profile/utils/tabs';
import { getVnpayUrlAPI } from '~/APIs';

const TrackingOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [debounce, setDebounce] = useState(false);
  const navigate = useNavigate();

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

  // Mutate lấy VNPAY URL
  const { mutate: getVnpayUrl } = useMutation({
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

  const handleRePaymentVNPAY = (orderCode, totalPayment) => {
    useSwalWithConfirm
      .fire({
        icon: 'warning',
        title: 'Cảnh báo!',
        text: 'Xác nhận thanh toán lại cho đơn hàng này?',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Không',
      })
      .then((result) => {
        if (result.isConfirmed) {
          getVnpayUrl({
            orderId: orderCode,
            amount: totalPayment,
          });
        }
      });
  };

  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderNotLoginAPI,
    onSuccess: () => {
      useSwal
        .fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Yêu cầu của bạn đã được gửi thành công.',
          confirmButtonText: 'Xác nhận',
        })
        .then(() => {
          mutate(orderCode.trim());
        });
    },
    onError: (error) => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: error?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const handleOpenReasonModal = (actionType, orderId) => {
    const reasons =
      actionType === 'cancel' ? reasonsForCancel : reasonsForReturn;

    // Add security key prompt first
    Swal.fire({
      title: 'Nhập mã bảo mật',
      input: 'password',
      inputPlaceholder: 'Nhập mã bảo mật được gửi trong gmail',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập mã bảo mật!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const secretKey = result.value;

        // Original reason modal
        Swal.fire({
          title:
            actionType === 'cancel' ? 'Lý do hủy đơn hàng' : 'Lý do trả hàng',
          html: `
            <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; align-items: center;">
              <select id="reason-select" class="select select-error">
              ${reasons
                .map((reason) => `<option value="${reason}">${reason}</option>`)
                .join('')}
            </select>
            <textarea id="custom-reason" class="textarea w-full" placeholder="Nhập lý do khác..." style="display: none; margin-top: 10px;"></textarea>
            </div>
          `,
          preConfirm: () => {
            const selectedReason =
              document.getElementById('reason-select').value;
            const customReason = document
              .getElementById('custom-reason')
              .value.trim();

            if (selectedReason === 'Lý do khác' && !customReason) {
              Swal.showValidationMessage('Vui lòng nhập lý do!');
            }

            return selectedReason === 'Lý do khác'
              ? customReason
              : selectedReason;
          },
          scrollbarPadding: false,
          showCancelButton: true,
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy',
          didOpen: () => {
            const reasonSelect = document.getElementById('reason-select');
            const customReasonInput = document.getElementById('custom-reason');

            reasonSelect.addEventListener('change', () => {
              if (reasonSelect.value === 'Lý do khác') {
                customReasonInput.style.display = 'block';
              } else {
                customReasonInput.style.display = 'none';
              }
            });
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const statusData =
              actionType === 'cancel'
                ? {
                    status: 'cancelled',
                    note: 'Khách hàng hủy đơn!',
                    reason: result.value,
                  }
                : {
                    status: 'returned',
                    note: 'Khách hàng yêu cầu trả hàng!',
                    reason: result.value,
                    returnStatus: 'pending',
                  };

            cancelOrder({
              id: orderId,
              data: { status: statusData },
              secretKey,
            });

            mutate(orderCode);
          }
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

  const handleReOrder = (data) => {
    useSwalWithConfirm
      .fire({
        icon: 'question',
        title: 'Đặt lại đơn hàng',
        text: 'Xác nhận đặt lại đơn hàng này?',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Không',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/thanh-toan', {
            state: {
              selectedProducts: data?.productsList,
            },
          });
        }
      });
  };

  const handleCancelOrder = (orderId) =>
    handleOpenReasonModal('cancel', orderId);
  const handleReturnOrder = (orderId) =>
    handleOpenReasonModal('return', orderId);

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <Helmet>
        <title>BMT Life | Theo dõi đơn hàng </title>
      </Helmet>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <input
            type="text"
            className="w-full max-w-lg rounded-md border border-gray-300 p-3 text-sm bg-white text-gray-900"
            placeholder="Nhập mã đơn hàng được gửi trong gmail"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
          />
          <button
            type="submit"
            className="btn rounded-md bg-red-500 hover:bg-red-700 text-white px-6 py-2"
            disabled={debounce}
          >
            Tìm kiếm đơn hàng
          </button>
        </form>

        {searchedOrder && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Theo dõi đơn hàng {orderCode}
            </h2>

            <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
              <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 lg:max-w-xl xl:max-w-2xl">
                {searchedOrder?.productsList?.map((product) => (
                  <>
                    <div className="space-y-4 p-6">
                      <div className="flex items-center max-lg:gap-2 gap-6">
                        <Link
                          to={`/san-pham/${product?.slug}`}
                          className="h-24 w-20"
                        >
                          <img
                            className="h-full w-full"
                            src={product?.image}
                            alt={product?.name}
                          />
                        </Link>
                        <Link
                          to={`/san-pham/${product?.slug}`}
                          className="flex-1 font-medium text-gray-900 hover:underline"
                        >
                          {product?.name}
                        </Link>
                        <p className="text-sm font-normal text-gray-900 max-lg:w-[80px]">
                          <span className="font-medium text-gray-900">
                            Loại:
                          </span>{' '}
                          <span className="text-indigo-700">
                            {product?.variantColor}
                            {product?.variantSize !== 'FREESIZE' &&
                              ` - ${product.variantSize}`}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div></div>
                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900">
                            x{product?.quantity}
                          </p>
                          <p className="text-xl font-bold leading-tight text-red-600">
                            {formatCurrencyVND(product?.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="p-6 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-4">
                      {/* Tổng tiền hàng */}
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Tổng tiền hàng:
                        </span>
                        <span className="col-span-8 text-red-600 font-bold text-lg text-right">
                          {formatCurrencyVND(searchedOrder?.totalPrice)}
                        </span>
                      </div>

                      {/* Phí ship */}
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Phí giao hàng:
                        </span>
                        <span className="col-span-8 text-orange-700 text-right">
                          + {formatCurrencyVND(searchedOrder?.fee)}
                        </span>
                      </div>

                      {/* Giảm giá */}
                      {searchedOrder.discountPercentage && (
                        <div className="grid grid-cols-12">
                          <span className="col-span-4 font-medium text-gray-700">
                            Giảm giá:
                          </span>
                          <span className="col-span-8 text-green-600 text-right">
                            - {formatCurrencyVND(searchedOrder.discountAmount)}
                          </span>
                        </div>
                      )}

                      {/* Phương thức thanh toán */}
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Phương thức thanh toán:
                        </span>
                        <span className="col-span-8 text-gray-900 text-right">
                          {searchedOrder?.paymentMethod}
                        </span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Người nhận:
                        </span>
                        <span className="col-span-8 text-gray-900 font-bold text-right">
                          {searchedOrder?.shippingInfo?.name} -{' '}
                          {formatVietnamesePhoneNumber(
                            searchedOrder?.shippingInfo?.phone
                          )}
                        </span>
                      </div>

                      {/* Địa chỉ giao hàng */}
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Địa chỉ giao hàng:
                        </span>
                        <span className="col-span-8 text-gray-900 text-right">
                          {searchedOrder?.shippingInfo?.fullAddress}
                        </span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Ngày giao hàng dự kiến:
                        </span>
                        <span className="col-span-8 text-gray-900 text-right">
                          {formatDateToDDMMYYYY(
                            searchedOrder?.estimatedDeliveryDate
                          )}
                        </span>
                      </div>

                      {/* Ghi chú */}
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-medium text-gray-700">
                          Ghi chú:
                        </span>
                        <span className="col-span-8 text-gray-700 text-sm text-right">
                          {searchedOrder?.shippingInfo?.note || 'Không'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grow sm:mt-8 lg:mt-0">
                <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Lịch sử đơn hàng
                  </h3>

                  <ol className="relative ms-3 border-s border-gray-200">
                    {[...searchedOrder.status]
                      .reverse()
                      .map((status, index) => {
                        const isLastStatus = index === 0;
                        const isCancelled = status.status === 'cancelled';
                        const isReturned = status.status === 'returned';

                        const returnStatusName = isReturned
                          ? returnStatus.find(
                              (item) => item.status === status.returnStatus
                            )?.name
                          : null;

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
                                    icon="mdi:close-circle-outline"
                                    className="h-4 w-4 text-red-600"
                                  />
                                ) : (
                                  <Icon
                                    icon="mdi:clock-outline"
                                    className="h-4 w-4 text-blue-600"
                                  />
                                )
                              ) : (
                                <Icon
                                  icon="mdi:checkbox-marked-circle-outline"
                                  className="h-4 w-4 text-green-600"
                                />
                              )}
                            </span>
                            <h4 className="mb-0.5 text-base font-semibold">
                              {new Date(status.createdAt).toLocaleString()}
                            </h4>
                            <p className="text-sm">{status.note}</p>
                            {/* Hiển thị lý do nếu có */}
                            {status.reason && (
                              <p className="text-sm text-gray-700">
                                <strong>Lý do:</strong> {status.reason}
                              </p>
                            )}

                            {/* Hiển thị trạng thái trả hàng nếu có */}
                            {isReturned && returnStatusName && (
                              <p className="text-sm text-gray-700">
                                <strong>Trạng thái trả hàng:</strong>{' '}
                                {returnStatusName}
                              </p>
                            )}
                          </li>
                        );
                      })}
                  </ol>

                  <div className="gap-4 sm:flex sm:items-center">
                    <button
                      type="button"
                      className="w-full btn rounded-md bg-red-600 hover:bg-red-700 text-white"
                      disabled={
                        searchedOrder?.status[searchedOrder?.status.length - 1]
                          .status === 'cancelled'
                      }
                      onClick={() => handleCancelOrder(searchedOrder?._id)}
                    >
                      Hủy đơn hàng
                    </button>
                  </div>

                  {searchedOrder?.status.at(-1).status === 'paymentPending' && (
                    <div className="gap-4 sm:flex sm:items-center">
                      <button
                        type="button"
                        className="w-full btn rounded-md bg-red-600 hover:bg-red-700 text-white"
                        onClick={() =>
                          handleRePaymentVNPAY(
                            searchedOrder?.orderCode,
                            searchedOrder?.totalPayment
                          )
                        }
                      >
                        Thanh toán lại
                      </button>
                    </div>
                  )}

                  {searchedOrder?.status.at(-1).status === 'delivered' && (
                    <div className="gap-4 sm:flex sm:items-center">
                      <button
                        type="button"
                        className="w-full btn rounded-md bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleReturnOrder(searchedOrder?._id)}
                      >
                        Yêu cầu trả hàng
                      </button>
                    </div>
                  )}

                  {searchedOrder?.status.at(-1).status === 'completed' && (
                    <div className="gap-4 sm:flex sm:items-center">
                      <button
                        type="button"
                        className="w-full btn rounded-md bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleReOrder(searchedOrder)}
                      >
                        Mua lại đơn hàng
                      </button>
                    </div>
                  )}
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
