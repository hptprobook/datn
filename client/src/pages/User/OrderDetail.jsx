import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderByCodeAPI, getVnpayUrlAPI, updateOrderAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import OrderDetailStatus from './Profile/components/OrderDetailStatus';
import {
  getStatusName,
  reasonsForCancel,
  reasonsForReturn,
  returnStatus,
  tabs,
} from './Profile/utils/tabs';
import {
  formatCurrencyVND,
  formatVietnamesePhoneNumber,
} from '~/utils/formatters';
import ReviewModal from './ReviewModal';
import { useState } from 'react';
import Swal from 'sweetalert2';

const OrderDetail = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ['getOrderDetail', orderCode],
    queryFn: () => getOrderByCodeAPI(orderCode),
    staleTime: 0,
    cacheTime: 0,
  });

  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderAPI,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng đã được hủy thành công.',
        confirmButtonText: 'Xác nhận',
      });
      refetch();
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

  const currentStatus = data?.status[data?.status.length - 1]?.status;

  if (error) {
    useSwal
      .fire({
        title: 'Lỗi!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      })
      .then(() => {
        navigate(-1);
      });
  }

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

  const handleReOrder = () => {
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

  const handleOpenReasonModal = (actionType) => {
    const reasons =
      actionType === 'cancel' ? reasonsForCancel : reasonsForReturn;

    Swal.fire({
      title: actionType === 'cancel' ? 'Lý do hủy đơn hàng' : 'Lý do trả hàng',
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
        const selectedReason = document.getElementById('reason-select').value;
        const customReason = document
          .getElementById('custom-reason')
          .value.trim();

        if (selectedReason === 'Lý do khác' && !customReason) {
          Swal.showValidationMessage('Vui lòng nhập lý do!');
        }

        return selectedReason === 'Lý do khác' ? customReason : selectedReason;
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
          id: data?._id,
          data: { status: statusData },
        });
      }
    });
  };

  const handleCancelOrder = () => handleOpenReasonModal('cancel');
  const handleReturnOrder = () => handleOpenReasonModal('return');

  const handleRePaymentVNPAY = () => {
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
            orderId: data?.orderCode,
            amount: data?.totalPayment,
          });
        }
      });
  };

  if (isLoading || cancelOrderLoading) return <MainLoading />;

  return (
    <>
      {showReviewModal && (
        <ReviewModal
          products={data?.productsList}
          orderId={data?._id}
          onClose={() => setShowReviewModal(false)}
          refetch={refetch}
        />
      )}
      <div className="container mx-auto p-4 bg-white text-black flex flex-col sm:flex-row items-center justify-between rounded-sm">
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-red-500 mb-2 sm:mb-0"
          onClick={() => navigate(-1)}
        >
          <Icon icon="ep:d-arrow-left" /> <span>Trở lại</span>
        </div>
        <div className="flex items-center gap-4 text-sm justify-between w-full sm:w-auto">
          <div>
            Mã đơn hàng: <b className="text-red-500">#{orderCode}</b>
          </div>
          <span className="text-xs hidden sm:block">|</span>
          <div>
            <b className="text-red-500 uppercase">
              {getStatusName(data?.status[data?.status?.length - 1]?.status)}
            </b>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <OrderDetailStatus status={data?.status} />
        <div className="flex flex-col sm:flex-row justify-center gap-3 px-12 mt-0">
          {currentStatus !== 'completed' &&
            currentStatus !== 'cancelled' &&
            currentStatus !== 'delivered' && (
              <button
                onClick={handleCancelOrder}
                className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full sm:w-48"
              >
                Huỷ đơn
              </button>
            )}
          {currentStatus === 'completed' && (
            <>
              <button
                onClick={handleReOrder}
                className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full sm:w-48"
              >
                Mua lại
              </button>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
                disabled={data?.isComment}
              >
                {data?.isComment ? 'Đã đánh giá' : 'Đánh giá'}
              </button>
            </>
          )}
          {currentStatus === 'delivered' && (
            <button
              onClick={handleReturnOrder}
              className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
            >
              Yêu cầu trả hàng
            </button>
          )}

          {currentStatus === 'paymentPending' && (
            <button
              onClick={handleRePaymentVNPAY}
              className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
            >
              Thanh toán lại
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <div className="grid grid-cols-12 gap-6 max-lg:gap-0 max-lg:grid-cols-1">
          <div className="col-span-4 max-lg:col-span-6">
            <div className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Địa chỉ nhận hàng
              </h3>
              <div>
                <div>
                  <p className="text-md font-bold text-gray-700 uppercase">
                    {data?.shippingInfo?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    {formatVietnamesePhoneNumber(data?.shippingInfo?.phone)}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    {data?.shippingInfo?.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-7 max-lg:col-span-6">
            <div className="space-y-6 bg-white p-6 md:border-l border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Trạng thái giao hàng
              </h3>

              <ol className="relative ms-3 border-s border-gray-200">
                {/* Hiển thị trạng thái tiếp theo (màu xám) */}
                {(() => {
                  const currentTab = tabs.find(
                    (tab) => tab.key === currentStatus
                  );
                  const nextTab = tabs.find(
                    (tab) => tab.step === (currentTab?.step || 0) + 1
                  );

                  if (nextTab && currentTab?.step !== 0) {
                    return (
                      <li className="mb-10 ms-6 text-gray-500">
                        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white">
                          <Icon
                            icon="mdi:clock-outline"
                            className="h-4 w-4 text-gray-500"
                          />
                        </span>
                        <h4 className="mb-0.5 text-base font-semibold">
                          Đang chờ ...
                        </h4>
                        <p className="text-sm">{nextTab.name}</p>
                      </li>
                    );
                  }
                  return null;
                })()}
                {data?.status
                  ?.slice()
                  .reverse()
                  .map((status, index) => {
                    const isMostRecent = index === 0;
                    const currentTab = tabs.find(
                      (tab) => tab.key === status.status
                    );
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
                          isCancelled
                            ? 'text-red-600' // Màu đỏ cho trạng thái hủy
                            : isMostRecent
                            ? 'text-blue-600 font-semibold' // Font đậm cho trạng thái hiện tại
                            : 'text-green-600 font-semibold' // Font đậm cho trạng thái đã qua
                        }`}
                      >
                        <span
                          className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${
                            isCancelled
                              ? 'bg-red-100' // Nền đỏ cho trạng thái hủy
                              : isMostRecent
                              ? 'bg-blue-100'
                              : 'bg-green-100'
                          } ring-8 ring-white`}
                        >
                          {isCancelled ? (
                            <Icon
                              icon="mdi:close-circle-outline" // Icon hủy đơn hàng
                              className="h-4 w-4 text-red-600"
                            />
                          ) : isMostRecent ? (
                            <Icon
                              icon="mdi:checkbox-marked-circle-outline" // Icon check (✓) cho trạng thái hiện tại
                              className="h-4 w-4 text-blue-600"
                            />
                          ) : (
                            <Icon
                              icon={
                                currentTab?.icon ||
                                'mdi:checkbox-marked-circle-outline'
                              } // Icon từ tabs cho các trạng thái cũ
                              className="h-4 w-4 text-green-600"
                            />
                          )}
                        </span>
                        <div className="flex items-center">
                          <h4 className="mb-0.5 text-base font-semibold">
                            {new Date(status.createdAt).toLocaleString()}
                          </h4>
                          {/* Badge "Hiện tại" cho trạng thái hiện tại */}
                          {isMostRecent && (
                            <span className="badge badge-success rounded-md ml-5">
                              Hiện tại
                            </span>
                          )}
                        </div>
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
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <div>
          {data?.productsList?.map((product) => (
            <div
              key={product?._id}
              className="grid grid-cols-12 items-center mt-4 gap-4"
            >
              <div className="col-span-12 sm:col-span-6 flex">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-12 h-12 object-cover"
                />
                <div className="ml-4">
                  <p className="font-medium text-sm sm:text-md text-clamp-1">
                    {product?.name}
                  </p>
                  <span className="text-red-500 text-xs sm:text-sm text-clamp-1">
                    {product?.variantColor}
                    {product?.variantSize !== 'FREESIZE' &&
                      ` - ${product.variantSize}`}
                  </span>
                </div>
              </div>

              <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
                <p>{formatCurrencyVND(product?.price)}</p>
              </div>

              <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
                <p>x{product?.quantity}</p>
              </div>

              <div className="col-span-4 sm:col-span-2 text-right text-xs sm:text-sm font-normal">
                <p>{formatCurrencyVND(product?.price * product?.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <div className="grid grid-cols-12 gap-4 mt-6 pb-8">
          <div className="col-span-6"></div>

          <div className="col-span-12 lg:col-span-6">
            <div className="mt-4">
              <div className="flex justify-between">
                <p>Tổng tiền hàng</p>
                <p className="text-gray-800">
                  {formatCurrencyVND(data?.totalPrice)}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Tổng tiền phí vận chuyển</p>
                <p className="text-red-500">+ {formatCurrencyVND(data?.fee)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Voucher giảm giá</p>
                <p className="text-green-500">
                  - {formatCurrencyVND(data?.discountPrice)}
                </p>
              </div>
              <div className="flex justify-between mt-4 pt-2">
                <p className="font-semibold text-lg">Tổng thanh toán</p>
                <p className="font-bold text-red-500 text-xl">
                  {formatCurrencyVND(data?.totalPayment)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <div className="text-right text-gray-500 text-sm">
          Phương thức thanh toán: {data?.paymentMethod}
        </div>
      </div>
    </>
  );
};

OrderDetail.propTypes = {};

export default OrderDetail;
