import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';

const TrackingOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const orderStatus = [
    {
      id: 1,
      status: 'Chờ xác nhận',
      time: '19 Nov 2023, 10:45',
      icon: 'mdi:clock-outline', // icon cho trạng thái chờ xác nhận
      active: true,
    },
    {
      id: 2,
      status: 'Đang xử lý',
      time: '19 Nov 2023, 10:47',
      icon: 'mdi:cogs', // icon cho trạng thái đang xử lý
      active: true,
    },
    {
      id: 3,
      status: 'Đang ở kho',
      time: '22 Nov 2023, 12:27',
      icon: 'mdi:warehouse', // icon cho trạng thái đang ở kho
      active: true,
    },
    {
      id: 4,
      status: 'Đang được gửi',
      time: '23 Nov 2023, 15:15',
      icon: 'mdi:truck-delivery-outline', // icon cho trạng thái đang gửi
      active: true,
    },
    {
      id: 5,
      status: 'Đơn vị vận chuyển đang giao hàng',
      time: '24 Nov 2023',
      icon: 'mdi:truck-fast', // icon cho trạng thái giao hàng
      active: false,
    },
    {
      id: 6,
      status: 'Đã nhận hàng',
      time: '',
      icon: 'mdi:checkbox-marked-circle-outline', // icon cho trạng thái đã nhận
      active: false,
    },
  ];

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <Helmet>
        <title>BMT Life | Theo dõi đơn hàng </title>
      </Helmet>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Form nhập mã đơn hàng */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <input
            type="text"
            className="w-full max-w-lg rounded-lg border border-gray-300 p-3 text-sm"
            placeholder="Nhập mã đơn hàng được gửi trong gmail"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            Tìm kiếm đơn hàng
          </button>
        </form>

        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Theo dõi đơn hàng #957684673
        </h2>

        <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
          <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 lg:max-w-xl xl:max-w-2xl">
            {/* Sản phẩm */}
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-6">
                <a href="#" className="h-14 w-14 shrink-0">
                  <img
                    className="h-full w-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                    alt="imac image"
                  />
                </a>
                <a
                  href="#"
                  className="min-w-0 flex-1 font-medium text-gray-900 hover:underline"
                >
                  Áo thun nam
                </a>
                <p className="text-sm font-normal text-gray-500">
                  <span className="font-medium text-gray-900">Loại:</span> Đỏ -
                  M
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div></div>
                <div className="flex items-center justify-end gap-4">
                  <p className="text-base font-normal text-gray-900">x1</p>
                  <p className="text-xl font-bold leading-tight text-gray-900">
                    300.000đ
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Tổng tiền hàng:
                    </span>
                    <span className="text-gray-900">300.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phí ship:</span>
                    <span className="text-gray-900">20.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Giảm giá:</span>
                    <span className="text-gray-900">-10.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Phương thức thanh toán:
                    </span>
                    <span className="text-gray-900">
                      Thanh toán khi nhận hàng
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 ">
                      Địa chỉ giao hàng:
                    </span>
                    <span className="text-gray-900 ">
                      123 Đường ABC, Quận X, TP.HCM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Ghi chú:</span>
                    <span className="text-gray-900">Giao hàng trước 18:00</span>
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
                {orderStatus.map((status) => (
                  <li
                    key={status.id}
                    className={`mb-10 ms-6 ${
                      status.active ? 'text-gray-500' : 'text-red-600'
                    }`}
                  >
                    <span
                      className={`absolute -start-3 flex h-6 w-6 items-center justify-cen rounded-full ${
                        status.active ? 'bg-primary-100' : 'bg-gray-100'
                      } ring-8 ring-white`}
                    >
                      <Icon
                        icon={status.icon}
                        className={`h-4 w-4 ${
                          status.active ? 'text-primary-700' : 'text-gray-500'
                        }`}
                      />
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold">
                      {status.time ? status.time : status.status}
                    </h4>
                    <p className="text-sm">
                      {status.time ? status.status : ''}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="gap-4 sm:flex sm:items-center">
                <button
                  type="button"
                  className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  Hủy đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingOrderPage;
