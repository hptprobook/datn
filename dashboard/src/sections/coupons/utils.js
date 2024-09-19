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
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
export const couponSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Tên khuyến mãi là bắt buộc.')
    .typeError('Tên khuyến mãi phải là một chuỗi văn bản.')
    .max(255, 'Tên khuyến mãi không được vượt quá 255 ký tự.'),

  code: Yup.string()
    .trim()
    .required('Mã khuyến mãi là bắt buộc.')
    .typeError('Mã khuyến mãi phải là một chuỗi văn bản.')
    .max(20, 'Mã khuyến mãi không được vượt quá 20 ký tự.')
    .min(4, 'Mã khuyến mãi phải có ít nhất 4 ký tự.'),
  type: Yup.string()
    .trim()
    .oneOf(['percent', 'price', 'shipping'], 'Loại khuyến mãi phải là một trong các giá trị sau: percent, price, shipping')
    .required('Loại khuyến mãi là bắt buộc.')
    .default('percent'),

  applicableProducts: Yup.array()
    .of(Yup.string().trim())
    .default([]),

  minPurchasePrice: Yup.number()
    .min(0, 'Giá trị mua tối thiểu phải lớn hơn hoặc bằng 0.')
    .typeError('Giá trị mua tối thiểu phải là một số.')
    .max(99999999, 'Giá trị mua tối thiểu không được vượt quá 99999999.'),
  maxPurchasePrice: Yup.number()
    .required('Giá trị mua tối đa là bắt buộc.')
    .min(Yup.ref('minPurchasePrice'), 'Giá trị mua tối đa phải lớn hơn hoặc bằng giá trị mua tối thiểu.')
    .max(99999999, 'Giá trị mua tối đa không được vượt quá 99999999.')
    .typeError('Giá trị mua tối đa phải là một số.'),
  discountValue: Yup.number()
    .typeError('Giá trị khuyến mãi phải là một số.')
    .min(0, 'Giá trị khuyến mãi phải lớn hơn hoặc bằng 0.')
    .max(99999999, 'Giá trị khuyến mãi không được vượt quá 99999999.'),
  discountPercent: Yup.number()
    .typeError('Phần trăm khuyến mãi phải là một số.')
    .min(0, 'Phần trăm khuyến mãi phải lớn hơn hoặc bằng 0.')
    .max(100, 'Phần trăm khuyến mãi không được vượt quá 100.'),
  description: Yup.string()
    .trim()
    .required('Mô tả khuyến mãi là bắt buộc.')
    .min(10, 'Mô tả khuyến mãi phải có ít nhất 10 ký tự.')
    .max(255, 'Mô tả khuyến mãi không được vượt quá 255 ký tự.'),

  usageLimit: Yup.number()
    .required('Giới hạn sử dụng là bắt buộc.')
    .integer('Giới hạn sử dụng phải là một số nguyên.')
    .min(1, 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1.')
    .max(99999, 'Giới hạn sử dụng không được vượt quá 99999.'),

  status: Yup.string()
    .trim()
    .oneOf(['active', 'inactive', 'expired'], 'Trạng thái phải là một trong các giá trị sau: active, inactive, expired.')
    .default('active'),

  limitOnUser: Yup.boolean()
    .default(false)
    .typeError('Giới hạn sử dụng cho mỗi người dùng phải là một giá trị boolean.'),

  dateStart: Yup.date()
    .typeError('Ngày bắt đầu không hợp lệ'),


  dateEnd: Yup.date()
    .typeError('Ngày kết thúc không hợp lệ')
});