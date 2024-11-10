import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getCurrentOrders,
  getCurrentOrderWithStatus,
  updateOrderAPI,
} from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import EmptyCart from '~/components/Home/Header/EmptyCart';
import { formatCurrencyVND, formatDateToDDMMYYYY } from '~/utils/formatters';
import { getStatusColor, getStatusName, tabs } from './Profile/utils/tabs';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import OrderLoading from '~/components/common/Loading/OrderLoading';

const MyOrder = () => {
  const { tab } = useParams();
  const [limitOrder, setLimitOrder] = useState(10);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(tab || 'all'); // 'all' là mặc định
  const tabsRef = useRef(null);

  useEffect(() => {
    setSelectedTab(tab || 'all');
  }, [tab]);

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    setLimitOrder(10);
    navigate(`/nguoi-dung/${newTab}`);
  };

  const fetchOrders = ({ queryKey }) => {
    const [, limit, status] = queryKey;
    return status === 'all'
      ? getCurrentOrders({ limit })
      : getCurrentOrderWithStatus({ limit, status });
  };

  const {
    data,
    refetch: refetchOrderData,
    isLoading,
  } = useQuery({
    queryKey: ['orders', limitOrder, selectedTab],
    queryFn: fetchOrders,
    staleTime: 30000,
    keepPreviousData: true,
    cacheTime: 30000,
  });

  const orderData = data?.result || [];

  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderAPI,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng đã được hủy thành công.',
        confirmButtonText: 'Xác nhận',
      });
      refetchOrderData();
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

  const filteredOrders =
    selectedTab === 'all'
      ? orderData
      : orderData?.filter(
          (order) =>
            order?.status[order.status.length - 1].status === selectedTab
        );

  // const getCurrentOrderStatus = (orderId) => {
  //   const order = orderData.find((order) => order._id === orderId);
  //   if (!order) return 'Không tồn tại';
  //   return order.status[order.status.length - 1];
  // };

  const handleScrollLeft = () => {
    tabsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    tabsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  const handleCancelOrder = (orderId) => {
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
            id: orderId,
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

  const handleReOrder = (order) => {
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
              selectedProducts: order?.productsList,
            },
          });
        }
      });
  };

  const handleLoadMore = () => {
    setLimitOrder((prev) => prev + 10);
  };

  if (cancelOrderLoading) return <MainLoading />;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white text-black relative">
      {isLoading && <OrderLoading />}
      <div className="relative">
        <button
          onClick={handleScrollLeft}
          className="absolute -left-8 top-0 h-full z-10 p-2"
        >
          <Icon className="text-2xl" icon="mingcute:left-fill" />
        </button>
        <div
          ref={tabsRef}
          className="flex overflow-x-auto border-b border-gray-300 hide-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 font-medium whitespace-nowrap ${
                selectedTab === tab.key
                  ? 'border-b-4 border-red-500 text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleScrollRight}
          className="absolute -right-8 top-0 h-full z-10 p-2"
        >
          <Icon className="text-2xl" icon="mingcute:right-fill" />
        </button>
      </div>
      <div className="mt-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 mb-4 bg-zinc-100 shadow-md border-t border-gray-100 rounded-md"
            >
              <Link
                to={`/nguoi-dung/don-hang/${order.orderCode}`}
                className="flex justify-between items-center py-2 border-b border-gray-300"
              >
                <div className="flex gap-5 items-center">
                  <span className="text-lg font-bold">
                    Đơn hàng: #{order.orderCode}
                  </span>{' '}
                  -
                  <i className="text-gray-500">
                    {formatDateToDDMMYYYY(
                      order.status[order.status.length - 1].createdAt,
                      'dd/MM/yyyy'
                    )}
                  </i>
                </div>
                <div>
                  <span
                    className={`uppercase font-bold ${getStatusColor(
                      order.status[order.status.length - 1].status
                    )}`}
                  >
                    {getStatusName(
                      order.status[order.status.length - 1].status
                    )}
                  </span>
                </div>
              </Link>
              <Link
                className="mt-2"
                to={`/nguoi-dung/don-hang/${order.orderCode}`}
              >
                {order?.productsList.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 border-b border-gray-300 last:border-none"
                  >
                    <div className="flex gap-5 items-center">
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-16 h-20 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <span>{product?.name}</span>
                        <div className="text-indigo-600">
                          {product?.variantColor}
                          {product?.variantSize !== 'FREESIZE' &&
                            ` - ${product.variantSize}`}
                        </div>
                        <span>x {product?.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end justify-center text-orange-600 ml-10">
                      <span>{formatCurrencyVND(product?.price)}</span>
                    </div>
                  </div>
                ))}
              </Link>
              <div className="flex justify-end border-t border-gray-200 pt-6">
                <span className="text-lg">
                  Tổng cộng:{' '}
                  <span className="font-bold text-red-600 text-xl ml-4">
                    {formatCurrencyVND(order?.totalPayment)}
                  </span>
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Link
                  to={`/nguoi-dung/don-hang/${order.orderCode}`}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Chi tiết
                </Link>
                {order.status[order.status.length - 1].status ===
                  'completed' && (
                  <>
                    <button
                      onClick={() => handleReOrder(order)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Mua lại
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                      Đánh giá
                    </button>
                  </>
                )}
                {order.status[order.status.length - 1].status !== 'cancelled' &&
                  order.status[order.status.length - 1].status !==
                    'completed' &&
                  order.status[order.status.length - 1].status !== 'received' &&
                  order.status[order.status.length - 1].status !==
                    'delivered' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Hủy đơn
                    </button>
                  )}
                {order.status[order.status.length - 1].status ===
                  'received' && (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                    Yêu cầu hoàn trả
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyCart usedBy="order" />
        )}
        {orderData.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="btn btn-primary text-white hover:bg-red-600 rounded-md mt-8"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MyOrder.propTypes = {};

export default MyOrder;
