import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentOrders } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import EmptyCart from '~/components/Home/Header/EmptyCart';
import { formatCurrencyVND, formatDateToDDMMYYYY } from '~/utils/formatters';

const tabs = [
  { name: 'Tất cả đơn hàng', key: 'all', color: 'text-black' },
  { name: 'Chờ xác nhận', key: 'pending', color: 'text-blue-500' },
  { name: 'Đã xác nhận', key: 'confirmed', color: 'text-green-500' },
  { name: 'Đã giao cho ĐVVC', key: 'shipping', color: 'text-orange-500' },
  { name: 'Đã nhận hàng', key: 'delivered', color: 'text-purple-500' },
  { name: 'Hoàn trả hàng', key: 'returned', color: 'text-green-700' },
  { name: 'Đã hủy', key: 'cancelled', color: 'text-red-500' },
];

const getStatusColor = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.color : 'text-gray-500';
};

const getStatusName = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.name : 'Không xác định';
};

const MyOrder = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const tabsRef = useRef(null);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getCurrentOrders,
    staleTime: 0,
    cacheTime: 0,
  });

  if (isLoading) return <MainLoading />;

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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white text-black">
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
              onClick={() => setSelectedTab(tab.key)}
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
                    className={getStatusColor(
                      order.status[order.status.length - 1].status
                    )}
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
                        className="w-20 h-20 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <span>{product?.name}</span>
                        <div>
                          <span>{product?.variantColor}</span> -
                          <span> {product?.variantSize}</span>
                        </div>
                        <span>x {product?.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end justify-center text-red-600 ml-10">
                      <span>{formatCurrencyVND(product?.price)}</span>
                    </div>
                  </div>
                ))}
              </Link>
              <div className="flex justify-end border-t border-gray-200 pt-6">
                <span className="text-lg">
                  Tổng cộng:{' '}
                  <span className="font-bold text-red-600 text-xl ml-4">
                    {formatCurrencyVND(order?.totalPrice)}
                  </span>
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                  Chi tiết
                </button>
                {order.status[order.status.length - 1].status ===
                  'Đã hoàn thành' && (
                  <>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">
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
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">
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
      </div>
    </div>
  );
};

MyOrder.propTypes = {};

export default MyOrder;
