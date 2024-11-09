import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderByCodeAPI, updateOrderAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import OrderDetailStatus from './Profile/components/OrderDetailStatus';
import { getStatusName, tabs } from './Profile/utils/tabs';
import {
  formatCurrencyVND,
  formatVietnamesePhoneNumber,
} from '~/utils/formatters';

const OrderDetail = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();

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

  const handleCancelOrder = () => {
    useSwalWithConfirm
      .fire({
        icon: 'warning',
        title: 'Xác nhận hủy đơn hàng?',
        text: 'Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Không',
      })
      .then((result) => {
        if (result.isConfirmed) {
          cancelOrder({
            id: data?._id,
            data: {
              status: {
                status: 'cancelled',
                note: 'Khách hàng huỷ đơn!',
              },
            },
          });
        }
      });
  };

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

  if (isLoading || cancelOrderLoading) return <MainLoading />;

  return (
    <>
      <div className="container mx-auto p-4 bg-white text-black flex items-center justify-between rounded-sm">
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          <Icon icon="ep:d-arrow-left" /> <span>Trở lại</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            Mã đơn hàng: <b className="text-red-500">#{orderCode}</b>
          </div>
          <span className="text-xs">|</span>
          <div>
            <b className="text-red-500 uppercase">
              {getStatusName(data?.status[data?.status?.length - 1]?.status)}
            </b>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <OrderDetailStatus status={data?.status} />
        <div className="flex justify-center gap-3 px-12 mt-0">
          {currentStatus !== 'completed' &&
            currentStatus !== 'cancelled' &&
            currentStatus !== 'delivered' && (
              <button
                onClick={handleCancelOrder}
                className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white min-w-48"
              >
                Huỷ đơn
              </button>
            )}
          {currentStatus === 'completed' && (
            <>
              <button
                onClick={handleReOrder}
                className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white min-w-48"
              >
                Mua lại
              </button>
              <button className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white min-w-48">
                Đánh giá
              </button>
            </>
          )}
          {currentStatus === 'delivered' && (
            <button className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white min-w-48">
              Yêu cầu trả hàng
            </button>
          )}
        </div>
      </div>
      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
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

          <div className="col-span-7">
            <div className="space-y-6 bg-white p-6 border-l border-gray-200">
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
