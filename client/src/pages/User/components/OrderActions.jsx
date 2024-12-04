import PropTypes from 'prop-types';

const OrderActions = ({
  currentStatus,
  data,
  handleCancelOrder,
  handleReturnOrder,
  handleReOrder,
  handleRePaymentVNPAY,
  setShowReviewModal,
}) => (
  <div className="flex flex-col sm:flex-row justify-center gap-3 px-12 mt-0">
    {currentStatus !== 'completed' &&
      currentStatus !== 'cancelled' &&
      currentStatus !== 'delivered' && (
        <button
          onClick={handleCancelOrder}
          className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full sm:w-48"
        >
          Huỷ đơn
        </button>
      )}
    {currentStatus === 'completed' && (
      <>
        <button
          onClick={handleReOrder}
          className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full sm:w-48"
        >
          Mua lại
        </button>
        <button
          onClick={() => setShowReviewModal(true)}
          className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
          disabled={data?.isComment}
        >
          {data?.isComment ? 'Đã đánh giá' : 'Đánh giá'}
        </button>
      </>
    )}
    {currentStatus === 'delivered' && (
      <button
        onClick={handleReturnOrder}
        className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
      >
        Yêu cầu trả hàng
      </button>
    )}
    {currentStatus === 'paymentPending' && (
      <button
        onClick={handleRePaymentVNPAY}
        className="btn bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md text-white w-full md:w-48"
      >
        Thanh toán lại
      </button>
    )}
  </div>
);

OrderActions.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  handleCancelOrder: PropTypes.func.isRequired,
  handleReturnOrder: PropTypes.func.isRequired,
  handleReOrder: PropTypes.func.isRequired,
  handleRePaymentVNPAY: PropTypes.func.isRequired,
  setShowReviewModal: PropTypes.func.isRequired,
};

export default OrderActions;
