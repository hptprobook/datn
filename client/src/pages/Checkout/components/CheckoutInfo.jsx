import { useNavigate } from 'react-router-dom';

export default function CheckoutInfo() {
  const navigate = useNavigate();

  const handleConfirmCheckout = () => {
    navigate('/thanh-toan/xac-nhan');
  };

  return (
    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
      <div className="flow-root">
        <h4 className="mb-8 font-bold text-xl">ĐƠN HÀNG</h4>
        <div className="-my-3 divide-gray-200 dark:divide-gray-800">
          <form className="flex mb-3">
            <input
              type="text"
              className="w-search h-10 rounded-l-md outline-none pl-3 text-sm border"
              placeholder="Mã giảm giá"
            />
            <button
              type="submit"
              className="w-40 h-10 text-sm bg-red-700 text-white rounded-r-md flex justify-center items-center"
            >
              Áp dụng
            </button>
          </form>
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Tạm tính
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              400.000 đ
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Phí vận chuyển
            </dt>
            <dd className="text-base font-medium text-green-700 dark:text-white">
              + 34.000 đ
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Mã giảm giá
            </dt>
            <dd className="text-base font-medium text-red-700 dark:text-white">
              - 32.000 đ
            </dd>
          </dl>

          <div className="divider" />

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Tổng tiền
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              402.000 đ
            </dd>
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
}
