import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderByCodeAPI, getVnpayUrlAPI, updateOrderAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import OrderDetailStatus from './Profile/components/OrderDetailStatus';
import { getStatusName, reasonsForCancel, reasonsForReturn, tabs } from './Profile/utils/tabs';
import { formatCurrencyVND, formatVietnamesePhoneNumber } from '~/utils/formatters';
import ReviewModal from './ReviewModal';
import { useState } from 'react';
import Swal from 'sweetalert2';
import OrderActions from './components/OrderActions';
import OrderProducts from './components/OrderProducts';
import OrderSummary from './components/OrderSummary';

const OrderDetail = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ['getOrderDetail', orderCode],
    queryFn: () => getOrderByCodeAPI(orderCode),
    staleTime: 0,
    cacheTime: 0,
  });

  const { mutate: cancelOrder, isLoading: cancelOrderLoading } = useMutation({
    mutationFn: updateOrderAPI,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng đã được hủy thành công.',
        confirmButtonText: 'Xác nhận',
      });
      refetch();
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

  const currentStatus = data?.status[data?.status.length - 1]?.status;

  if (error) {
    useSwal
      .fire({
        title: 'Lỗi!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Xác nhận',
      })
      .then(() => {
        navigate(-1);
      });
  }

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

  // Handle re-order functionality
  const handleReOrder = () => {
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
              selectedProducts: data?.productsList,
            },
          });
        }
      });
  };

  // Handle re-payment with VNPAY
  const handleRePaymentVNPAY = () => {
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
            amount: data?.totalPayment,
          });
        }
      });
  };

  // Handle opening reason modal for cancel/return
  const handleOpenReasonModal = (type) => {
    const reasons = type === 'cancel' ? reasonsForCancel : reasonsForReturn;
    const title = type === 'cancel' ? 'Lý do hủy đơn hàng' : 'Lý do trả hàng';
    const status = type === 'cancel' ? 'cancelled' : 'returned';
    const note = type === 'cancel' ? 'Khách hàng hủy đơn!' : 'Khách hàng yêu cầu trả hàng!';

    Swal.fire({
      title,
      html: `
        <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; align-items: center;">
          <select id="reason-select" class="select select-error w-full">
            ${reasons.map((reason) => `<option value="${reason}">${reason}</option>`).join('')}
          </select>
          <textarea id="custom-reason" class="textarea w-full" placeholder="Nhập lý do khác..." style="display: none; margin-top: 10px;"></textarea>
        </div>
      `,
      preConfirm: () => {
        const selectedReason = document.getElementById('reason-select').value;
        const customReason = document.getElementById('custom-reason').value.trim();

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
          status,
          note,
          reason: result.value,
          ...(type === 'return' && { returnStatus: 'pending' }),
        };

        cancelOrder({
          id: data?._id,
          data: { status: statusData },
        });
      }
    });
  };

  if (isLoading || cancelOrderLoading || !data) return <MainLoading />;

  return (
    <>
      {showReviewModal && (
        <ReviewModal
          products={data?.productsList}
          orderId={data?._id}
          onClose={() => setShowReviewModal(false)}
          refetch={refetch}
        />
      )}
      <div className="container mx-auto p-4 bg-white text-black flex flex-col sm:flex-row items-center justify-between rounded-sm">
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-red-500 mb-2 sm:mb-0"
          onClick={() => navigate(-1)}
        >
          <Icon icon="ep:d-arrow-left" /> <span>Trở lại</span>
        </div>
        <div className="flex items-center gap-4 text-sm justify-between w-full sm:w-auto">
          <div>
            Mã đơn hàng: <b className="text-red-500">#{orderCode}</b>
          </div>
          <span className="text-xs hidden sm:block">|</span>
          <div>
            <b className="text-red-500 uppercase">
              {getStatusName(data?.status[data?.status?.length - 1]?.status)}
            </b>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
        <OrderDetailStatus status={data?.status} />
        <OrderActions
          currentStatus={currentStatus}
          data={data}
          handleCancelOrder={() => handleOpenReasonModal('cancel')}
          handleReturnOrder={() => handleOpenReasonModal('return')}
          handleReOrder={handleReOrder}
          handleRePaymentVNPAY={handleRePaymentVNPAY}
          setShowReviewModal={setShowReviewModal}
        />
      </div>

      <OrderProducts productsList={data?.productsList} />

      <OrderSummary
        totalPrice={data?.totalPrice}
        fee={data?.fee}
        discountPrice={data?.discountPrice}
        totalPayment={data?.totalPayment}
        paymentMethod={data?.paymentMethod}
      />
    </>
  );
};

OrderDetail.propTypes = {};

export default OrderDetail;
