export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (data) => data.shipping.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const statusConfig = {
  pending: { value: 'Pending', label: 'Đang chờ', color: 'primary' },
  shipping: { value: 'Processing', label: 'Đang xử lý', color: 'info' },
  delivered: { value: 'Delivered', label: 'Đã giao hàng', color: 'success' },
  cancelled: { value: 'Canceled', label: 'Đã hủy', color: 'error' },
  confirmed: { value: 'Confirmed', label: 'Đã xác nhận', color: 'primary' },
  shipped: { value: 'Shipped', label: 'Đã vận chuyển', color: 'success' },
  returned: { value: 'Returned', label: 'Đã trả lại', color: 'warning' },
  refunded: { value: 'Refunded', label: 'Đã hoàn tiền', color: 'warning' },
  onHold: { value: 'On Hold', label: 'Đang giữ', color: 'error' },
  completed: { value: 'Completed', label: 'Hoàn thành', color: 'success' },
  paymentPending: { value: 'Payment Pending', label: 'Chờ thanh toán', color: 'warning' },
};
export const statusDeliverConfig = {
  pending: { value: 'Pending', label: 'Đang chờ', color: 'primary' },
  processing: { value: 'Processing', label: 'Đang xử lý', color: 'info' },
  delivered: { value: 'Delivered', label: 'Đã giao hàng', color: 'success' },
  cancelled: { value: 'Canceled', label: 'Đã hủy', color: 'error' },
  confirmed: { value: 'Confirmed', label: 'Đã xác nhận', color: 'primary' },
  shipped: { value: 'Shipped', label: 'Đã vận chuyển', color: 'success' },
  returned: { value: 'Returned', label: 'Đã trả lại', color: 'warning' },
  refunded: { value: 'Refunded', label: 'Đã hoàn tiền', color: 'warning' },
  onHold: { value: 'On Hold', label: 'Đang giữ', color: 'error' }
};

export const paymentConfig = {
  "Tiền mặt": { value: 'Tiền mặt', label: 'Thanh toán tiền mặt', icon: 'ic:round-monetization-on' },
  "Chuyển khoản": { value: 'Chuyển khoản', label: 'Card', icon: 'ic:round-credit-card' },
  "Ví điện tử": { value: 'Ví điện tử', label: 'Ví điện tử', icon: 'ic:round-account-balance-wallet' },
  "Thẻ tín dụng": { value: 'Thẻ tín dụng', label: 'Thẻ tín dụng', icon: 'ic:round-credit-card' }
};

export const handleStatusConfig = {
  pending: { value: 'confirmed', label: 'Xác nhận đơn hàng', icon: 'eva:checkmark-outline' },
  confirmed: { value: 'shipping', label: 'Giao hàng', icon: 'eva:car-outline' },
  shipped: { value: 'confirmed', label: 'Hoàn thành', icon: 'eva:checkmark-square-outline' },
  shipping: { value: 'shipped', label: 'Đã giao', icon: 'eva:clipboard-outline' },
};