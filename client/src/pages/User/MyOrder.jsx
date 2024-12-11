import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getCurrentOrders,
  getCurrentOrderWithStatus,
  getVnpayUrlAPI,
  searchOrderAPI,
  updateOrderAPI,
} from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import EmptyCart from '~/components/Home/Header/EmptyCart';
import { formatCurrencyVND, formatDateToDDMMYYYY } from '~/utils/formatters';
import {
  getStatusColor,
  getStatusName,
  reasonsForCancel,
  reasonsForReturn,
  tabs,
} from './Profile/utils/tabs';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import OrderLoading from '~/components/common/Loading/OrderLoading';
import ReviewModal from './ReviewModal';
import Swal from 'sweetalert2';
import useDebounce from '~/customHooks/useDebounce';

const MyOrder = () => {
  const { tab } = useParams();
  const [limitOrder, setLimitOrder] = useState(10);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(tab || 'all'); // 'all' là mặc định
  const tabsRef = useRef(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewProducts, setReviewProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 1000);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    setSelectedTab(tab || 'all');
  }, [tab]);

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    setLimitOrder(10);
    navigate(`/nguoi-dung/${newTab}`);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const fetchOrders = ({ queryKey }) => {
    const [, limit, status, searchKeyword, sort] = queryKey;
    return searchKeyword
      ? searchOrderAPI({ limit, keyword: searchKeyword, sort })
      : status === 'all'
      ? getCurrentOrders({ limit, sort })
      : getCurrentOrderWithStatus({ limit, status, sort });
  };

  const {
    data,
    refetch: refetchOrderData,
    isLoading,
  } = useQuery({
    queryKey: ['orders', limitOrder, selectedTab, debouncedKeyword, sortOption], // Add sortOption to queryKey
    queryFn: fetchOrders,
    staleTime: 0,
    cacheTime: 0,
  });

  const handleSearchInput = (e) => {
    setKeyword(e.target.value);
  };

  // Mutate lấy VNPAY URL
  const { mutate: getVnpayUrl } = useMutation({
    mutationFn: getVnpayUrlAPI,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      useSwal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra với phương thức thanh toán bằng VNPAY, vui lòng thử lại sau!',
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const orderData = data?.result || [];

  // Mutate huỷ đơn hàng
  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderAPI,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng đã được hủy thành công.',
        confirmButtonText: 'Xác nhận',
      });
      refetchOrderData();
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: 'Không thể hủy đơn hàng, vui lòng thử lại.',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  // Lọc order theo tab
  const filteredOrders =
    selectedTab === 'all'
      ? orderData
      : orderData?.filter(
          (order) =>
            order?.status[order.status.length - 1].status === selectedTab
        );

  const handleScrollLeft = () => {
    tabsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    tabsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  // Hàm xử lý mua lại đơn
  const handleReOrder = (order) => {
    useSwalWithConfirm
      .fire({
        icon: 'question',
        title: 'Đặt lại đơn hàng',
        text: 'Xác nhận đặt lại đơn hàng này?',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Không',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/thanh-toan', {
            state: {
              selectedProducts: order?.productsList,
            },
          });
        }
      });
  };

  // Hàm xử lý xem thêm đơn
  const handleLoadMore = () => {
    setLimitOrder((prev) => prev + 10);
  };

  const handleShowReviewModal = (orderId, products) => {
    setReviewOrderId(orderId);
    setReviewProducts(products);
    setShowReviewModal(true);
  };

  // Hàm xử lý huỷ đơn
  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: 'Lý do hủy đơn hàng',
      html: `
        <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; align-items: center;">
          <select id="reason-select" class="select select-error w-full">
            ${reasonsForCancel
              .map((reason) => `<option value="${reason}">${reason}</option>`)
              .join('')}
          </select>
          <textarea id="custom-reason" class="textarea w-full" placeholder="Nhập lý do khác..." style="display: none; margin-top: 10px;"></textarea>
        </div>
      `,
      preConfirm: () => {
        const selectedReason = document.getElementById('reason-select').value;
        const customReason = document
          .getElementById('custom-reason')
          .value.trim();

        if (selectedReason === 'Lý do khác' && !customReason) {
          Swal.showValidationMessage('Vui lòng nhập lý do!');
        }

        return selectedReason === 'Lý do khác' ? customReason : selectedReason;
      },
      scrollbarPadding: false,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      didOpen: () => {
        const reasonSelect = document.getElementById('reason-select');
        const customReasonInput = document.getElementById('custom-reason');

        reasonSelect.addEventListener('change', () => {
          if (reasonSelect.value === 'Lý do khác') {
            customReasonInput.style.display = 'block';
          } else {
            customReasonInput.style.display = 'none';
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const statusData = {
          status: 'cancelled',
          note: 'Khách hàng hủy đơn!',
          reason: result.value,
        };

        cancelOrder({
          id: orderId,
          data: { status: statusData },
        });
      }
    });
  };

  // Hàm xử lý trả đơn
  const handleReturnOrder = (orderId) => {
    Swal.fire({
      title: 'Lý do trả hàng',
      html: `
        <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; align-items: center;">
          <select id="reason-select" class="select select-error w-full">
            ${reasonsForReturn
              .map((reason) => `<option value="${reason}">${reason}</option>`)
              .join('')}
          </select>
          <textarea id="custom-reason" class="textarea w-full" placeholder="Nhập lý do khác..." style="display: none; margin-top: 10px;"></textarea>
        </div>
      `,
      preConfirm: () => {
        const selectedReason = document.getElementById('reason-select').value;
        const customReason = document
          .getElementById('custom-reason')
          .value.trim();

        if (selectedReason === 'Lý do khác' && !customReason) {
          Swal.showValidationMessage('Vui lòng nhập lý do!');
        }

        return selectedReason === 'Lý do khác' ? customReason : selectedReason;
      },
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      didOpen: () => {
        const reasonSelect = document.getElementById('reason-select');
        const customReasonInput = document.getElementById('custom-reason');

        reasonSelect.addEventListener('change', () => {
          if (reasonSelect.value === 'Lý do khác') {
            customReasonInput.style.display = 'block';
          } else {
            customReasonInput.style.display = 'none';
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const statusData = {
          status: 'returned',
          note: 'Khách hàng yêu cầu trả hàng!',
          reason: result.value,
          returnStatus: 'pending',
        };

        cancelOrder({
          id: orderId,
          data: { status: statusData },
        });
      }
    });
  };

  // Hàm xử lý thanh toán lại
  const handleRePaymentVNPAY = (orderCode, totalPayment) => {
    useSwalWithConfirm
      .fire({
        icon: 'warning',
        title: 'Cảnh báo!',
        text: 'Xác nhận thanh toán lại cho đơn hàng này?',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Không',
      })
      .then((result) => {
        if (result.isConfirmed) {
          getVnpayUrl({
            orderId: orderCode,
            amount: totalPayment,
          });
        }
      });
  };

  if (cancelOrderLoading) return <MainLoading />;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white text-black relative">
      {isLoading && <OrderLoading />}
      <div className="relative overflow-hidden md:overflow-visible">
        <button
          onClick={handleScrollLeft}
          className="absolute -left-8 top-0 h-full z-10 p-2"
        >
          <Icon className="text-2xl" icon="mingcute:left-fill" />
        </button>
        <div
          ref={tabsRef}
          className="flex overflow-x-auto border-b border-gray-300 hide-scrollbar w-full"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 font-medium whitespace-nowrap max-w-full ${
                selectedTab === tab.key
                  ? 'border-b-4 border-red-500 text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleScrollRight}
          className="absolute -right-8 top-0 h-full z-10 p-2"
        >
          <Icon className="text-2xl" icon="mingcute:right-fill" />
        </button>
      </div>

      <div className="mt-4 w-full flex gap-4">
        <input
          type="text"
          value={keyword}
          onChange={handleSearchInput}
          placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc tên sản phẩm"
          className="w-[70%] rounded-md outline-none px-6 py-4 bg-gray-300 text-gray-500 placeholder:text-gray-500"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="w-[30%] rounded-md outline-none px-3 py-4 bg-gray-300 text-gray-500 placeholder:text-gray-500"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="priceDesc">Tổng tiền cao nhất</option>
          <option value="priceAsc">Tổng tiền thấp nhất</option>
        </select>
      </div>

      <div className="mt-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order?._id}
              className="p-4 mb-4 bg-zinc-100 shadow-md border-t border-gray-100 rounded-md"
            >
              {showReviewModal && (
                <ReviewModal
                  orderId={reviewOrderId}
                  products={reviewProducts}
                  onClose={() => setShowReviewModal(false)}
                  refetch={refetchOrderData}
                />
              )}
              <Link
                to={`/nguoi-dung/don-hang/${order?.orderCode}`}
                className="flex justify-between items-center py-2 border-b border-gray-300 max-lg:gap-2"
              >
                <div className="flex gap-5 items-center max-lg:gap-2">
                  <span className="text-lg font-bold">
                    Đơn hàng: #{order?.orderCode}
                  </span>{' '}
                  -
                  <i className="text-gray-500 hidden md:block">
                    {formatDateToDDMMYYYY(
                      order?.status[order.status.length - 1]?.createdAt,
                      'dd/MM/yyyy'
                    )}
                  </i>
                </div>
                <div className="text-right">
                  <span
                    className={`uppercase font-bold ${getStatusColor(
                      order?.status[order.status.length - 1]?.status
                    )}`}
                  >
                    {getStatusName(
                      order?.status[order.status.length - 1]?.status
                    )}
                  </span>
                </div>
              </Link>
              <Link
                className="mt-2"
                to={`/nguoi-dung/don-hang/${order?.orderCode}`}
              >
                {order?.productsList?.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 border-b border-gray-300 last:border-none"
                  >
                    <div className="flex gap-5 items-center">
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-16 h-20 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <span>{product?.name}</span>
                        <div className="text-indigo-600">
                          {product?.variantColor}
                          {product?.variantSize !== 'FREESIZE' &&
                            ` - ${product?.variantSize}`}
                        </div>
                        <span>x {product?.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end justify-center text-orange-600 ml-10">
                      <span>{formatCurrencyVND(product?.price)}</span>
                    </div>
                  </div>
                ))}
              </Link>
              <div className="flex justify-end border-t border-gray-200 pt-6">
                <span className="text-lg">
                  Tổng cộng:{' '}
                  <span className="font-bold text-red-600 text-xl ml-4">
                    {formatCurrencyVND(order?.totalPayment)}
                  </span>
                </span>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
                <Link
                  to={`/nguoi-dung/don-hang/${order?.orderCode}`}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-center"
                >
                  Chi tiết
                </Link>
                {order?.status[order.status.length - 1]?.status ===
                  'completed' && (
                  <>
                    <button
                      onClick={() => handleReOrder(order)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Mua lại
                    </button>
                    <button
                      onClick={() =>
                        handleShowReviewModal(order?._id, order?.productsList)
                      }
                      disabled={order?.isComment}
                      className=" btn bg-red-500 text-white rounded-md"
                    >
                      {order?.isComment ? 'Đã đánh giá' : 'Đánh giá'}
                    </button>
                  </>
                )}
                {order?.status[order?.status?.length - 1]?.status !==
                  'cancelled' &&
                  order?.status[order?.status?.length - 1]?.status !==
                    'completed' &&
                  order?.status[order?.status?.length - 1]?.status !==
                    'received' &&
                  order?.status[order?.status?.length - 1]?.status !==
                    'delivered' && (
                    <button
                      onClick={() => handleCancelOrder(order?._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Hủy đơn
                    </button>
                  )}
                {order?.status[order?.status?.length - 1]?.status ===
                  'received' && (
                  <button
                    onClick={() => handleReturnOrder(order?._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Yêu cầu hoàn trả
                  </button>
                )}
                {order?.status.at(-1)?.status === 'paymentPending' && (
                  <button
                    onClick={() =>
                      handleRePaymentVNPAY(
                        order?.orderCode,
                        order?.totalPayment
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Thanh toán lại
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyCart usedBy="order" />
        )}
        {orderData?.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="btn btn-primary text-white hover:bg-red-600 rounded-md mt-8"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MyOrder.propTypes = {};

export default MyOrder;
