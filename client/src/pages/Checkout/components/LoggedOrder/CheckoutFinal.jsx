// import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  createOrderAPI,
  getCouponsForOrder,
  getShippingFee,
  updateCurrentUser,
} from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import { formatCurrencyVND } from '~/utils/formatters';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '~/context/UserContext';

const paymentMethods = [
  { label: 'Thanh toán khi nhận hàng', value: 'Tiền mặt' },
  { label: 'Thanh toán VNPAY', value: 'VNPAY' },
  { label: 'Chuyển khoản trực tiếp', value: 'Chuyển khoản' },
];

const CheckoutFinal = ({ selectedProducts, userAddress }) => {
  const [shippingFee, setShippingFee] = useState(0);
  const { user, refetchUser } = useUser();
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState({
    label: 'Thanh toán khi nhận hàng',
    value: 'Tiền mặt',
  });
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [isPaymentClosing, setIsPaymentClosing] = useState(false);

  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [isVoucherClosing, setIsVoucherClosing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) {
      navigate('/gio-hang');
    }
  }, [selectedProducts, navigate]);

  // Đóng modal chọn phương thức thanh toán
  const handlePaymentClose = () => {
    setIsPaymentClosing(true);

    setTimeout(() => {
      setIsPaymentClosing(false);
      setOpenPaymentModal(false);
    }, 300);
  };

  // Xử lý thay đổi phuogwn thức thanh toán
  const handlePaymentMethodChange = (event) => {
    const selectedMethod = paymentMethods.find(
      (method) => method.value === event.target.value
    );
    setPaymentMethod(selectedMethod);
  };

  // Đóng modal voucher
  const handleVoucherClose = () => {
    setIsVoucherClosing(true);

    setTimeout(() => {
      setIsVoucherClosing(false);
      setOpenVoucherModal(false);
    }, 300);
  };

  const totalPrice = selectedProducts?.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const totalWeight = selectedProducts?.reduce(
    (acc, product) => acc + product.weight * product.quantity,
    0
  );

  const { data: coupons, isLoading: isLoadingCoupons } = useQuery({
    queryKey: ['coupons'],
    queryFn: getCouponsForOrder,
  });

  // Lấy phí ship dựa trên Địa chỉ giao hàng
  const fetchShippingFee = async () => {
    if (userAddress) {
      let data = {
        service_type_id: 2,
        from_district_id: 1552,
        to_district_id: userAddress.district_id,
        to_ward_code: userAddress.ward_id,
        weight: totalWeight || 1,
        items: selectedProducts.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          weight: product.weight,
        })),
      };

      try {
        let response = await getShippingFee(data);

        if (response?.data?.total <= 0) {
          data.service_type_id = 5;
          response = await getShippingFee(data);
        }

        setShippingFee(response?.data?.total);
      } catch (error) {
        useSwal.fire(
          'Lỗi!',
          'Lỗi khi lấy phí vận chuyển, vui lòng chọn một địa chỉ khác',
          'error'
        );
      }
    }
  };

  useEffect(() => {
    fetchShippingFee();
  }, [userAddress]);

  // mutate xoá sản phẩm khỏi giỏ hàng sau khi đặt thành công
  const { mutate: removeCart, isLoading: isRemovingCart } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      refetchUser();
    },
  });

  // Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
  const removeProductsFromCart = () => {
    const remainingProducts = user.carts.filter(
      (cartProduct) =>
        !selectedProducts.some((selected) => selected._id === cartProduct._id)
    );

    removeCart({ carts: remainingProducts });
  };

  // mutate đặt hàng
  const { mutate, isLoading } = useMutation({
    mutationFn: createOrderAPI,
    onSuccess: (data) => {
      removeProductsFromCart();
      useSwal
        .fire({
          title: 'Thành công!',
          text: 'Bạn đã đặt hàng thành công, bấm xác nhận để kiểm tra thông tin và liên hệ shop nếu có lỗi',
          icon: 'success',
          timer: 2000,
          confirmButtonText: 'Xác nhận',
        })
        .then(() => {
          navigate('/thanh-toan/xac-nhan', { state: { orderData: data } });
        });
    },
    onError: () => {
      useSwal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra trong quá trình đặt hàng, vui lòng thử lại',
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  // Xử lý đặt hàng
  const handleCheckout = () => {
    if (!userAddress) {
      useSwal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng chọn địa chỉ giao hàng',
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      });
    }

    const productsList = selectedProducts.map((product) => ({
      _id: product.productId || product._id,
      quantity: product.quantity,
      image: product.image,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      weight: product.weight,
      price: product.price,
      variantColor: product.variantColor,
      variantSize: product.variantSize,
      itemTotal: product.price * product.quantity,
    }));

    const data = {
      orderCode: uuidv4().slice(0, 6).toUpperCase(),
      productsList,
      shippingInfo: {
        provinceName: userAddress.province_name,
        districtName: userAddress.district_name,
        districtCode: userAddress.district_id,
        wardName: userAddress.ward_name,
        wardCode: userAddress.ward_id,
        detailAddress: userAddress.address,
        phone: userAddress.phone,
        name: userAddress.name,
        note: userAddress.note,
        fullAddress: userAddress.fullAddress,
      },
      email: userAddress.email,
      totalPrice: totalPrice,
      shippingType: 'cod',
      fee: shippingFee,
    };

    if (userAddress) {
      useSwalWithConfirm
        .fire({
          title: 'Xác nhận đặt hàng?',
          icon: 'question',
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy',
        })
        .then((result) => {
          if (result.isConfirmed) {
            mutate(data);
          }
        });
    } else {
      useSwal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng chọn địa chỉ giao hàng',
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      });
    }
  };

  const [visibleCounts, setVisibleCounts] = useState({
    order: 5,
    shipping: 5,
  });

  const handleShowMore = (type) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 5,
    }));
  };

  const [selectedDiscount, setSelectedDiscount] = useState({
    orderPercent: null,
    orderPrice: null,
    shipping: null,
  });

  useEffect(() => {
    const discount =
      (selectedDiscount.orderPercent
        ? (totalPrice * selectedDiscount.orderPercent.discountValue) / 100
        : 0) +
      (selectedDiscount.orderPrice
        ? selectedDiscount.orderPrice.discountValue
        : 0) +
      (selectedDiscount.shipping ? shippingFee : 0);

    setVoucherDiscount(discount);
  }, [selectedDiscount, totalPrice, shippingFee]);

  const handleCouponSelect = (coupon, type) => {
    setSelectedDiscount((prev) => {
      if (type === 'order') {
        if (coupon.type === 'percent') {
          return {
            ...prev,
            orderPercent: prev.orderPercent?._id === coupon._id ? null : coupon,
            orderPrice: null,
          };
        } else if (coupon.type === 'price') {
          return {
            ...prev,
            orderPrice: prev.orderPrice?._id === coupon._id ? null : coupon,
            orderPercent: null,
          };
        }
      } else if (type === 'shipping') {
        return {
          ...prev,
          shipping: prev.shipping?._id === coupon._id ? null : coupon,
        };
      }
      return prev;
    });
  };

  if (isLoading || isRemovingCart || isLoadingCoupons) return <MainLoading />;

  return (
    <>
      <div className="px-4 py-5 shadow-md text-gray-900 rounded-sm bg-gray-50 mt-4 sm:px-6 lg:px-8">
        {openVoucherModal && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
              isVoucherClosing ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={handleVoucherClose}
            ></div>
            <div className="bg-white p-6 rounded-lg relative z-10 min-w-[700px] max-w-[800px] max-h-[80vh] overflow-y-auto hide-scrollbar">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                onClick={handleVoucherClose}
              >
                <FaTimes size={20} />
              </button>

              <h2 className="font-bold text-black mb-4">Nhập mã giảm giá</h2>
              <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="w-[80%] border border-gray-300 h-[40px] px-4 bg-white text-gray-600 rounded-s-md"
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  type="submit"
                  className="w-[20%] bg-red-500 text-white px-4 h-[40px] rounded-e-md"
                >
                  Áp dụng
                </button>
              </form>
              <div>
                {['shipping', 'order'].map((type) => (
                  <div key={type} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 capitalize">
                      {type === 'order'
                        ? 'Giảm giá cho đơn hàng'
                        : 'Phí vận chuyển'}
                    </h3>
                    <ul className="space-y-3">
                      {coupons[type]
                        .slice(0, visibleCounts[type])
                        .map((coupon) => (
                          <li
                            key={coupon._id}
                            className={`flex items-center justify-between rounded-md cursor-pointer px-8 py-2 border ${
                              (type === 'order' &&
                                (selectedDiscount.orderPercent?._id ===
                                  coupon._id ||
                                  selectedDiscount.orderPrice?._id ===
                                    coupon._id)) ||
                              (type === 'shipping' &&
                                selectedDiscount.shipping?._id === coupon._id)
                                ? 'bg-red-50 border-red-400'
                                : ''
                            }`}
                          >
                            <div
                              onClick={() => handleCouponSelect(coupon, type)}
                              className="flex items-center space-x-8"
                            >
                              <div>
                                <Icon
                                  className="text-5xl text-red-600"
                                  icon="icon-park-outline:ticket"
                                />
                              </div>
                              <div>
                                <p className="text-md font-semibold">
                                  {coupon?.name}
                                </p>
                                <p className="text-md">
                                  Mã giảm giá: <strong>{coupon?.code}</strong>
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                  {coupon?.description}
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={
                                (type === 'order' &&
                                  (selectedDiscount.orderPercent?._id ===
                                    coupon._id ||
                                    selectedDiscount.orderPrice?._id ===
                                      coupon._id)) ||
                                (type === 'shipping' &&
                                  selectedDiscount.shipping?._id === coupon._id)
                              }
                              className="checkbox h-5 w-5 text-red-600"
                              onChange={() => handleCouponSelect(coupon, type)}
                            />
                          </li>
                        ))}
                    </ul>

                    {/* Nút "Xem thêm" */}
                    {coupons[type].length > visibleCounts[type] && (
                      <button
                        onClick={() => handleShowMore(type)}
                        className="text-blue-500 hover:underline mt-2"
                      >
                        Xem thêm
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 right-8 flex justify-end gap-3">
                <button
                  type="submit"
                  className="btn bg-red-600 rounded-md mt-4"
                  onClick={handleVoucherClose}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3">
            <Icon icon="ri:coupon-line" className="text-red-600 text-2xl" />
            <p className="ml-2">BMT Life Voucher</p>
          </div>
          <button
            className="text-blue-500"
            onClick={() => setOpenVoucherModal(true)}
          >
            Chọn Voucher
          </button>
        </div>
        <div className="container mx-auto mt-8">
          {selectedDiscount.orderPercent ||
          selectedDiscount.orderPrice ||
          selectedDiscount.shipping ? (
            <div className="container mx-auto mt-8">
              <h4>Bạn đã chọn:</h4>
              <div className="space-y-4">
                {selectedDiscount.orderPercent && (
                  <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
                    <h3 className="text-xl uppercase font-semibold my-4">
                      {selectedDiscount.orderPercent.name}
                    </h3>
                    <p className="pb-4">
                      {selectedDiscount.orderPercent.description}
                    </p>

                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
                  </div>
                )}

                {selectedDiscount.orderPrice && (
                  <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
                    <h3 className="text-xl uppercase font-semibold my-4">
                      {selectedDiscount.orderPrice.name}
                    </h3>
                    <p className="pb-4">
                      {selectedDiscount.orderPrice.description}
                    </p>

                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
                  </div>
                )}

                {selectedDiscount.shipping && (
                  <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
                    <h3 className="text-xl uppercase font-semibold my-4">
                      {selectedDiscount.shipping.name}
                    </h3>
                    <p className="pb-4">
                      {selectedDiscount.shipping.description}
                    </p>

                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                    <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Chưa có mã giảm giá nào được chọn.</p>
          )}
        </div>
      </div>

      {openPaymentModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isPaymentClosing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handlePaymentClose}
          ></div>
          <div className="bg-white p-6 rounded-lg relative z-10 min-w-[520px] max-w-[800px] max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={handlePaymentClose}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="font-bold text-black mb-8">
              Thay đổi phương thức thanh toán
            </h2>
            <div id="group1" className="flex flex-col gap-3 text-gray-900 mt-4">
              {paymentMethods.map((method, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer gap-2 items-center"
                >
                  <input
                    type="radio"
                    className="radio"
                    name="group1"
                    value={method.value}
                    checked={paymentMethod.value === method.value}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setOpenPaymentModal(false)}
              type="button"
              className="btn bg-red-600 rounded-md mt-8"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-8 shadow-md text-gray-900 rounded-sm bg-gray-50 mt-4 sm:px-6 lg:px-8">
        <div className="md:flex justify-between items-center border-b border-gray-200 pb-8">
          <h3 className="font-semibold text-xl">Phương thức thanh toán</h3>
          <div className="flex items-center gap-4">
            <span>{paymentMethod.label}</span>
            <button
              onClick={() => setOpenPaymentModal(true)}
              className="text-blue-500 hover:underline hover:text-red-600"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6 border-b border-gray-200 pb-8">
          <div className="col-span-6"></div>

          <div className="col-span-12 lg:col-span-6">
            <div className="mt-4">
              <div className="flex justify-between">
                <p>Tổng tiền hàng</p>
                <p className="text-gray-800">{formatCurrencyVND(totalPrice)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Tổng tiền phí vận chuyển</p>
                <p className="text-red-500">
                  + {formatCurrencyVND(shippingFee)}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Voucher giảm giá</p>
                <p className="text-green-500">
                  - {formatCurrencyVND(voucherDiscount)}
                </p>
              </div>
              <div className="flex justify-between mt-4 pt-2">
                <p className="font-semibold text-lg">Tổng thanh toán</p>
                <p className="font-bold text-red-500 text-xl">
                  {formatCurrencyVND(
                    totalPrice + shippingFee - voucherDiscount
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mt-10 pb-3">
          <p className="text-sm text-gray-400 mt-2 text-center lg:text-left">
            Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản{' '}
            <Link to="/" className="font-semibold">
              BMT Life
            </Link>
          </p>
          <button
            onClick={handleCheckout}
            className="btn rounded-md bg-red-500 hover:bg-red-600 text-white w-full md:w-48 mt-4 lg:mt-0"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </>
  );
};

CheckoutFinal.propTypes = {};

export default CheckoutFinal;
