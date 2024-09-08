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
      (data) => data.userId.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const statusConfig = {
  Pending: { value: 'Pending', label: 'Pending', color: 'primary' },
  Processing: { value: 'Processing', label: 'Processing', color: 'info' },
  Delivered: { value: 'Delivered', label: 'Delivered', color: 'success' },
  Canceled: { value: 'Canceled', label: 'Canceled', color: 'error' },
  Confirmed: { value: 'Confirmed', label: 'Confirmed', color: 'primary' },
  Shipped: { value: 'Shipped', label: 'Shipped', color: 'success' },
  Returned: { value: 'Returned', label: 'Returned', color: 'warning' },
  Refunded: { value: 'Refunded', label: 'Refunded', color: 'warning' },
  OnHold: { value: 'On Hold', label: 'On Hold', color: 'error' }
};

export const paymentConfig = {
  Cash: { value: 'Cash', label: 'Thanh toán tiền mặt', icon: 'ic:round-monetization-on' },
  Card: { value: 'Card', label: 'Card', icon: 'ic:round-credit-card' },
  Paypal: { value: 'Paypal', label: 'Paypal', icon: 'ic:round-paypal' },
  Stripe: { value: 'Stripe', label: 'Stripe', icon: 'ic:round-stripe' },
  ApplePay: { value: 'Apple Pay', label: 'Apple Pay', icon: 'ic:round-apple-pay' },
  GooglePay: { value: 'Google Pay', label: 'Google Pay', icon: 'ic:round-google-pay' }
};
