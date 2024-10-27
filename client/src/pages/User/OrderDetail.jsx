import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderByCodeAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal } from '~/customHooks/useSwal';
import OrderDetailStatus from './Profile/components/OrderDetailStatus';

const OrderDetail = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ['getOrderDetail', orderCode],
    queryFn: () => getOrderByCodeAPI(orderCode),
  });

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

  if (isLoading) return <MainLoading />;

  return (
    <>
      <div className="container mx-auto p-4 bg-white text-black flex items-center justify-between rounded-sm">
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          <Icon icon="ep:d-arrow-left" /> <span>Trở lại</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            Mã đơn hàng: <b className="text-red-500">#{orderCode}</b>
          </div>
          <span className="text-xs">|</span>
          <div>
            <b className="text-red-500 uppercase">
              {data?.status[data?.status?.length - 1]?.status}
            </b>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 bg-white text-black rounded-sm mt-[1px] h-96">
        <OrderDetailStatus status={data?.status} />
      </div>
    </>
  );
};

OrderDetail.propTypes = {};

export default OrderDetail;
