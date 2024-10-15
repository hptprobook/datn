import { Icon } from '@iconify/react';
import { useState } from 'react';

const tabs = [
  { name: 'Tất cả đơn hàng', key: 'all' },
  { name: 'Chờ thanh toán', key: 'pending' },
  { name: 'Đang xử lý', key: 'processing' },
  { name: 'Đang giao', key: 'shipping' },
  { name: 'Đã giao', key: 'delivered' },
  { name: 'Đã hủy', key: 'cancelled' },
  { name: 'Đã hoàn trả', key: 'returned' },
];

const orders = [
  {
    _id: '123456',
    orderCode: '3D28SI4',
    date: '2023-01-01',
    status: 'delivery',
    products: [
      {
        name: 'Sản phẩm 1',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
      {
        name: 'Sản phẩm 3',
        color: 'Vàng',
        size: 'XL',
        quantity: 1,
        price: 150000,
      },
    ],
  },
  {
    _id: '123457',
    orderCode: '3D28SI5',
    date: '2023-01-01',
    status: 'pending',
    products: [
      {
        name: 'Sản phẩm 1',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
      {
        name: 'Sản phẩm 3',
        color: 'Vàng',
        size: 'XL',
        quantity: 1,
        price: 150000,
      },
    ],
  },
  {
    _id: '123458',
    orderCode: '3D28SI6',
    date: '2023-01-01',
    status: 'processing',
    products: [
      {
        name: 'Sản phẩm 1',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
      {
        name: 'Sản phẩm 3',
        color: 'Vàng',
        size: 'XL',
        quantity: 1,
        price: 150000,
      },
    ],
  },
  {
    _id: '123459',
    orderCode: '3D28SI7',
    date: '2023-01-01',
    status: 'shipping',
    products: [
      {
        name: 'Sản phẩm 1',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
      {
        name: 'Sản phẩm 3',
        color: 'Vàng',
        size: 'XL',
        quantity: 1,
        price: 150000,
      },
    ],
  },
];

const MyOrder = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filteredOrders =
    selectedTab === 'all'
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white text-black">
      <div className="flex overflow-auto border-b border-gray-300">
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
      <div className="mt-4">
        {filteredOrders.length > 0 ? (
          <table className="table w-full rounded-sm">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Sản phẩm</th>
                <th>Ngày mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <>
                  <tr
                    key={order._id}
                    className="bg-white hover:bg-gray-50 relative"
                  >
                    <td className="py-2 px-4 border-b">{order.orderCode}</td>
                    <td className="py-2 px-4 border-b">
                      {order.products.length} sản phẩm
                    </td>
                    <td className="py-2 px-4 border-b">{order.date}</td>
                    <td className="py-2 px-4 border-b text-red-500 font-bold">
                      {order.products
                        .reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )
                        .toLocaleString()}
                      đ
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`${
                          order.status === 'cancelled'
                            ? 'text-red-500'
                            : 'text-green-500'
                        } font-medium`}
                      >
                        {order.status === 'cancelled'
                          ? 'Khách hủy'
                          : order.status}
                      </span>
                    </td>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 z-10 bg-white cursor-pointer"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <Icon
                        icon={
                          expandedOrder === order._id
                            ? 'ant-design:up-circle-twotone'
                            : 'ant-design:down-circle-twotone'
                        }
                        className="text-xl"
                      />
                    </div>
                  </tr>

                  {expandedOrder === order._id && (
                    <div>
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 border-t border-gray-300"
                        >
                          <img
                            src="/placeholder.jpg"
                            alt={product.name}
                            className="w-16 h-16 object-cover mr-4"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              Kích thước: {product.size} - Màu sắc:{' '}
                              {product.color}
                            </p>
                          </div>
                          <p className="font-medium">x {product.quantity}</p>
                          <p className="font-medium ml-auto">
                            {(
                              product.price * product.quantity
                            ).toLocaleString()}
                            đ
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-medium text-gray-600">Trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

MyOrder.propTypes = {};

export default MyOrder;
