import { NavLink } from 'react-router-dom';
import Input from '~/components/common/TextField/Input';

const DeliveryDetail = () => {
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
    <div className="min-w-0 flex-1 space-y-8 text-gray-800">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ĐỊA CHỈ GIAO HÀNG
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id={'name'} label={'Họ và tên'} />

          <Input id={'email'} label={'Email'} type="email" />

          <Input id={'phone'} label={'Số điện thoại'} />

          <div></div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="select-country-input-3"
                className="block text-sm font-medium text-gray-900"
              >
                {' '}
                Tỉnh/ Thành phố*{' '}
              </label>
            </div>
            <select
              id="select-country-input-3"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              <option selected>An giang</option>
              <option value="AS">Đăk Lăk</option>
              <option value="FR">Đăk nông</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="select-city-input-3"
                className="block text-sm font-medium text-gray-900"
              >
                {' '}
                Quận/ Huyện*{' '}
              </label>
            </div>
            <select
              id="select-city-input-3"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              <option selected>San Francisco</option>
              <option value="NY">New York</option>
              <option value="LA">Los Angeles</option>
              <option value="CH">Chicago</option>
              <option value="HU">Houston</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="select-city-input-3"
                className="block text-sm font-medium text-gray-900"
              >
                {' '}
                Phường/ Xã*{' '}
              </label>
            </div>
            <select
              id="select-city-input-3"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              <option selected>San Francisco</option>
              <option value="NY">New York</option>
              <option value="LA">Los Angeles</option>
              <option value="CH">Chicago</option>
              <option value="HU">Houston</option>
            </select>
          </div>

          <Input id={'street'} label={'Số nhà/ Đường'} />

          <div className="sm:col-span-2">
            <div>
              <label
                htmlFor={'note'}
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                {' '}
                {'Ghi chú'}{' '}
              </label>
              <textarea
                rows={3}
                id={'note'}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                placeholder={'Ghi chú'}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div id="payment" className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Phương thức thanh toán
        </h3>

        <label className="flex cursor-pointer gap-2 items-center">
          <input type="radio" className="radio bg-white" name="payment" />
          <span>Thanh toán qua VNPAY</span>
        </label>

        <label className="flex cursor-pointer gap-2 items-center">
          <input
            type="radio"
            className="radio bg-white"
            name="payment"
            defaultChecked
          />
          <span>Thanh toán khi nhận hàng</span>
        </label>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900">Giỏ hàng</h3>
        <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
          <div className="col-span-5 md:col-span-5">
            <p className="font-normal text-md leading-8 text-gray-400">
              Sản phẩm
            </p>
          </div>
          <div className="col-span-6 md:col-span-7">
            <div className="grid grid-cols-5">
              <div className="col-span-4">
                <p className="font-normal text-md leading-8 text-gray-400 text-center">
                  Số lượng
                </p>
              </div>
              <div className="col-span-1">
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
              <div className="flex items-center justify-center md:justify-end max-md:mt-3 h-full md:col-span-4">
                <div className="flex items-center flex-col">
                  <p className="flex md:block font-bold text-md leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-amber-600">
                    <p className="mr-2 md:hidden">Tổng: </p>
                    {product.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DeliveryDetail.propTypes = {};

export default DeliveryDetail;
