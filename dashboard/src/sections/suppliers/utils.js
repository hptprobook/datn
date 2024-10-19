import * as Yup from 'yup';

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
      (supplier) => supplier.companyName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const supplierSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Tên công ty là bắt buộc.')
    .typeError('Tên công ty không hợp lệ.')
    .max(255, 'Tên công ty không được vượt quá 255 ký tự.'),

  fullName: Yup.string()
    .required('Họ và tên là bắt buộc.')
    .typeError('Họ và tên không hợp lệ.')
    .max(255, 'Họ và tên không được vượt quá 255 ký tự.'),

  phone: Yup.string()
    .required('Số điện thoại là bắt buộc.')
    .max(10, 'Số điện thoại không được vượt quá 10 ký tự.')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ.'),

  email: Yup.string()
    .required('Email là bắt buộc.')
    .max(100, 'Email không được vượt quá 100 ký tự.')
    .email('Email không hợp lệ.'),
  address: Yup.string()
    .required('Địa chỉ là bắt buộc.')
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự.'),
  registrationNumber: Yup.string()
    .required('Mã số đăng ký là bắt buộc.')
    .max(9, 'Mã số đăng ký không được vượt quá 9 ký tự.')
    .matches(/^\d{9}$/, 'Mã số đăng ký phải là 9 chữ số.'),
  website: Yup.string()
    .max(255, 'Website không được vượt quá 255 ký tự.')
    .url('Website không hợp lệ.'),
  productsSupplied: Yup.array()
    .typeError('Sản phẩm cung cấp không hợp lệ.'),
  rating: Yup.number()
    .typeError('Xếp hạng không hợp lệ.')
    .min(0, 'Xếp hạng phải lớn hơn hoặc bằng 0.')
    .max(5, 'Xếp hạng không được lớn hơn 5.'),
  notes: Yup.string()
    .typeError('Ghi chú không hợp lệ.')
    .max(500, 'Ghi chú không được vượt quá 500 ký tự.'),
});
