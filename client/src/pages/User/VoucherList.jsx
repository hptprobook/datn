import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCouponsForOrder } from '~/APIs';
import { useSwal } from '~/customHooks/useSwal';
import MainLoading from '~/components/common/Loading/MainLoading';

const VoucherList = () => {
  const { data: coupons, isLoading: isLoadingCoupons } = useQuery({
    queryKey: ['coupons'],
    queryFn: getCouponsForOrder,
  });

  const [visibleCounts, setVisibleCounts] = useState({
    shipping: 5,
    order: 5,
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    useSwal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Đã sao chép mã giảm giá: ' + code,
      confirmButtonText: 'Xác nhận',
      timer: 1000,
    });
  };

  const handleShowMore = (type) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 5,
    }));
  };

  if (isLoadingCoupons) return <MainLoading />;

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">Mã giảm giá dành cho bạn</h1>
      <div className="container mx-auto">
        {['shipping', 'order'].map((type) => (
          <div key={type} className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              {type === 'shipping'
                ? 'Miễn phí vận chuyển'
                : 'Khuyến mãi đơn hàng'}
            </h2>
            {coupons[type]
              .filter((coupon) => coupon.status === 'active')
              .slice(0, visibleCounts[type])
              .map((coupon) => (
                <div
                  key={coupon._id}
                  className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative"
                >
                  <h3 className="text-2xl font-semibold my-4">{coupon.name}</h3>
                  <p className="text-sm mb-4">{coupon.description}</p>
                  <div className="flex items-center space-x-2 mb-4 max-lg:flex-col max-lg:space-y-3">
                    <span className="border-dashed border text-white px-4 py-2 rounded-l">
                      {coupon.code}
                    </span>
                    <span
                      onClick={() => handleCopyCode(coupon.code)}
                      className="border border-white bg-white text-red-600 px-4 py-2 rounded-r cursor-pointer"
                    >
                      Copy Code
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Ngày hết hạn:{' '}
                    {new Date(coupon.dateEnd).toLocaleDateString('vi-VN')}
                  </p>
                  <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                  <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
                </div>
              ))}
            <div className="text-center">
              {coupons[type].filter((coupon) => coupon.status === 'active')
                .length > visibleCounts[type] && (
                <button
                  onClick={() => handleShowMore(type)}
                  className="mt-4 btn rounded-md btn-success"
                >
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherList;
