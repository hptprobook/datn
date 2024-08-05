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

const orders = {
  all: [
    {
      id: '123456',
      date: '2023-01-01',
      status: 'Đang giao',
      products: [
        { name: 'Sản phẩm 1', quantity: 2, price: 100000 },
        { name: 'Sản phẩm 2', quantity: 1, price: 200000 },
      ],
    },
    // Add more orders as needed
  ],
  pending: [],
  processing: [],
  shipping: [],
  delivered: [],
  cancelled: [],
  returned: [],
};

const MyOrder = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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
        {orders[selectedTab].length > 0 ? (
          orders[selectedTab].map((order) => (
            <div key={order.id} className="border p-4 mb-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="text-lg font-semibold">
                    Mã đơn hàng: {order.id}
                  </p>
                  <p>Ngày đặt hàng: {order.date}</p>
                  <p>Trạng thái: {order.status}</p>
                </div>
                <button
                  className="mt-2 sm:mt-0 text-blue-500 hover:underline"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? 'Ẩn chi tiết' : 'Hiện chi tiết'}
                </button>
              </div>
              {expandedOrder === order.id && (
                <div className="mt-4">
                  <p className="font-semibold">Sản phẩm đã đặt:</p>
                  <ul className="list-disc list-inside">
                    {order.products.map((product, index) => (
                      <li key={index} className="ml-4">
                        {product.name} - Số lượng: {product.quantity} - Giá:{' '}
                        {product.price}đ
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold mt-2">
                    Tổng tiền:{' '}
                    {order.products.reduce(
                      (total, product) =>
                        total + product.price * product.quantity,
                      0
                    )}
                    đ
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-medium text-gray-600">Trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
