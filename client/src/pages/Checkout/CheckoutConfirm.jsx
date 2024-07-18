import { NavLink } from 'react-router-dom';
import CheckoutStepper from '~/components/common/Stepper/CheckoutStepper';

export default function CheckoutConfirm() {
  const products = [
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
  ];

  return (
    <section className="py-24 relative max-w-container mx-auto">
      <div className="flex justify-center mb-12 pl-24">
        <CheckoutStepper currentStep={3} />
      </div>
      <div className="w-full px-4 md:px-5 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-11">
          Bạn đã đặt hàng thành công
        </h2>
        <h6 className="font-medium text-xl leading-8 text-black mb-3">
          Xin chào, Phan Thanh Hóa
        </h6>
        <p className="font-normal text-lg leading-8 text-gray-500 mb-4">
          Đơn đặt hàng của bạn đã được hoàn thành và sẽ được giao chỉ từ 2 - 3
          ngày.
        </p>
        <p className="font-normal text-lg leading-8 text-gray-500 mb-8">
          Bạn có thể theo dõi đơn hàng tại{' '}
          <NavLink to={'#'} className={'text-red-500'}>
            Trang cá nhân
          </NavLink>{' '}
          hoặc{' '}
          <NavLink to={'#'} className={'text-red-500'}>
            Tra cứu đơn hàng
          </NavLink>{' '}
          dựa trên mã đơn hàng
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Ngày giao hàng dự kiến
            </p>
            <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">
              30 / 8 / 2024
            </h6>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Mã đơn hàng
            </p>
            <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">
              #1023498789
            </h6>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Phương thức thanh toán
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="32"
              viewBox="0 0 46 32"
              fill="none"
            >
              <rect
                x="0.5"
                y="0.5"
                width="45"
                height="31"
                rx="5.5"
                fill="#1F72CD"
              />
              <rect
                x="0.5"
                y="0.5"
                width="45"
                height="31"
                rx="5.5"
                stroke="#F3F4F6"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.1282 11.333L3.88672 20.9953H8.96437L9.59385 19.4548H11.0327L11.6622 20.9953H17.2512V19.8195L17.7493 20.9953H20.6404L21.1384 19.7947V20.9953H32.7621L34.1755 19.4948L35.4989 20.9953L41.4691 21.0078L37.2143 16.1911L41.4691 11.333H35.5915L34.2157 12.8058L32.9339 11.333H20.2888L19.203 13.8269L18.0917 11.333H13.0246V12.4688L12.461 11.333H8.1282ZM9.1107 12.7051H11.5858L14.3992 19.2571V12.7051H17.1105L19.2835 17.4029L21.2862 12.7051H23.984V19.6384H22.3424L22.329 14.2055L19.9358 19.6384H18.4674L16.0607 14.2055V19.6384H12.6837L12.0435 18.0841H8.58456L7.94566 19.6371H6.13627L9.1107 12.7051ZM32.1608 12.7051H25.4859V19.6343H32.0574L34.1755 17.3379L36.217 19.6343H38.3512L35.2493 16.1898L38.3512 12.7051H36.3096L34.2023 14.9752L32.1608 12.7051ZM10.3147 13.8782L9.17517 16.6471H11.453L10.3147 13.8782ZM27.1342 15.4063V14.1406V14.1394H31.2991L33.1165 16.1636L31.2186 18.1988H27.1342V16.817H30.7756V15.4063H27.1342Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="box group">
            <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">
              Địa chỉ giao hàng
            </p>
            <h6 className="font-manrope text-md leading-9 text-black">
              45 / 19 Nguyễn Viết Xuân, Tân Thành, Buôn Mê Thuột, Đăk Lăk
            </h6>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
          <div className="col-span-5 md:col-span-5">
            <p className="font-normal text-md leading-8 text-gray-400">
              Sản phẩm
            </p>
          </div>
          <div className="col-span-6 md:col-span-7">
            <div className="grid grid-cols-5">
              <div className="col-span-3">
                <p className="font-normal text-md leading-8 text-gray-400 text-center">
                  Số lượng
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-normal text-md leading-8 text-gray-400 text-right">
                  Tổng tiền
                </p>
              </div>
            </div>
          </div>
        </div>
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group"
          >
            <div className="w-full md:max-w-[126px]">
              <img
                src={product.imgSrc}
                alt="product image"
                className="mx-auto"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 w-full">
              <div className="md:col-span-5">
                <div className="flex flex-col max-[500px]:items-center gap-3">
                  <NavLink to={'/'}>
                    <h6 className="font-semibold text-base leading-7 text-black hover:text-red-600 cursor-pointer">
                      {product.name}
                    </h6>
                  </NavLink>
                  <h6 className="font-normal text-base leading-7 text-gray-500">
                    {product.details}
                  </h6>
                  <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-amber-600">
                    {product.price}
                  </h6>
                </div>
              </div>
              <div className="flex items-center h-full max-md:mt-3 md:col-span-3 justify-center">
                1
              </div>
              <div className="flex items-center max-[100px]:justify-center md:justify-end max-md:mt-3 h-full md:col-span-4">
                <div className="flex items-center flex-col">
                  <p className="font-bold text-md leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-amber-600">
                    {product.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center sm:justify-end w-full my-6">
          <div className=" w-full">
            <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Tạm tính
              </p>
              <p className="font-semibold text-lg leading-8 text-gray-900">
                400.000 đ
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Phí giao hàng
              </p>
              <p className="font-semibold text-lg leading-8 text-green-600">
                + 34.000 đ
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-normal text-lg leading-8 text-gray-500">
                Giảm giá
              </p>
              <p className="font-semibold text-lg leading-8 text-red-600">
                - 32.000 đ
              </p>
            </div>
            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <p className="font-manrope font-semibold text-2xl leading-9 text-gray-900">
                Tổng tiền
              </p>
              <p className="font-manrope font-bold text-2xl leading-9 text-indigo-600">
                402.000 đ
              </p>
            </div>
          </div>
        </div>
        <div className="data ">
          <p className="font-normal text-lg leading-8 text-gray-500 mb-11">
            Chúng tôi sẽ gửi email xác nhận vận chuyển khi các mặt hàng được vận
            chuyển thành công.
          </p>
          <h6 className="font-manrope font-bold text-2xl leading-9 text-black mb-3">
            Cảm ơn bạn đã mua sắm ở w0wStore{' '}
            <NavLink
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to={'/'}
            >
              Tiếp tục mua sắm
              <span aria-hidden="true"> &rarr;</span>
            </NavLink>
          </h6>
        </div>
      </div>
    </section>
  );
}
