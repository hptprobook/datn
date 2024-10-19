import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        name: 'Sản phẩm 1 Sản phẩm 1  Sản phẩm  ',
        image: 'https://picsum.photos/150/150',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        image: 'https://picsum.photos/150/150',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
      {
        name: 'Sản phẩm 3',
        image: 'https://picsum.photos/150/150',
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
        image: 'https://picsum.photos/150/150',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        image: 'https://picsum.photos/150/150',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
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
        image: 'https://picsum.photos/150/150',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
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
        image: 'https://picsum.photos/150/150',
        color: 'Đỏ',
        size: 'M',
        quantity: 2,
        price: 100000,
      },
      {
        name: 'Sản phẩm 2',
        image: 'https://picsum.photos/150/150',
        color: 'Xanh',
        size: 'L',
        quantity: 1,
        price: 200000,
      },
    ],
  },
];

const MyOrder = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredOrders =
    selectedTab === 'all'
      ? orders
      : orders.filter((order) => order.status === selectedTab);

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
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 mb-4 bg-zinc-100 shadow-md border-t border-gray-100 rounded-md"
            >
              <Link
                to={`/nguoi-dung/chi-tiet-don-hang/${order._id}`}
                className="flex justify-between items-center py-2 border-b border-gray-300"
              >
                <div className="flex gap-5 items-center">
                  <span className="text-lg font-bold">
                    Đơn hàng: #{order.orderCode}
                  </span>{' '}
                  -<i className="text-gray-500">{order.date}</i>
                </div>
                <div>
                  <span className="text-gray-500">{order.status}</span>
                </div>
              </Link>
              <div className="mt-2">
                {order.products.map((product) => (
                  <Link
                    to={`/san-pham/${product.name}`}
                    key={product.name}
                    className="flex justify-between py-3 border-b border-gray-300 last:border-none"
                  >
                    <div className="flex gap-5 items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <span>{product.name}</span>
                        <div>
                          <span>{product.color}</span> -
                          <span> {product.size}</span>
                        </div>
                        <span>x {product.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end justify-center text-red-600 ml-10">
                      <span>{product.price.toLocaleString()}đ</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-end">
                <span className="text-lg font-bold">Tổng cộng: 1000000đ</span>
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                  Chi tiết
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                  Mua lại
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                  Đánh giá
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                  Hủy
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                  Yêu cầu hoàn trả
                </button>
              </div>
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

MyOrder.propTypes = {};

export default MyOrder;
