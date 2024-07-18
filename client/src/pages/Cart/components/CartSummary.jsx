import { useNavigate } from 'react-router-dom';

export default function CartSummary() {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/thanh-toan');
  };

  return (
    <div className="col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8">
      <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
        Đơn hàng
      </h2>
      <div className="mt-8">
        <div className="flex items-center justify-between pb-6">
          <p className="font-normal text-lg leading-8 text-black">3 sản phẩm</p>
          <p className="font-medium text-lg leading-8 text-black">480.000 đ</p>
        </div>
        <div className="divider"></div>
        <button
          className="w-full text-center bg-red-600 rounded-md py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-amber-700"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
