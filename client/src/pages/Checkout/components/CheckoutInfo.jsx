import { useNavigate } from 'react-router-dom';

const CheckoutInfo = () => {
  const navigate = useNavigate();

  const handleConfirmCheckout = () => {
    navigate('/thanh-toan/xac-nhan');
  };

  return (
    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md lg:sticky lg:top-4 lg:self-start">
      <div className="flow-root">
        <h4 className="mb-7 font-bold text-xl text-black">ĐƠN HÀNG</h4>
        <div className="-my-3 divide-gray-200">
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500">Tạm tính</dt>
            <dd className="text-base font-medium text-gray-900">400.000 đ</dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500">
              Phí vận chuyển
            </dt>
            <dd className="text-base font-medium text-green-700">+ 34.000 đ</dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500">Mã giảm giá</dt>
            <dd className="text-base font-medium text-red-700">- 32.000 đ</dd>
          </dl>

          <div className="divider" />

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-bold text-gray-900">Tổng tiền</dt>
            <dd className="text-base font-bold text-gray-900">402.000 đ</dd>
          </dl>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full text-center bg-red-600 rounded-md py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-amber-700"
          onClick={handleConfirmCheckout}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

CheckoutInfo.propTypes = {};

export default CheckoutInfo;
