// eslint-disable-next-line import/no-extraneous-dependencies
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
  if (!Array.isArray(inputData)) {
    inputData = []; // Ensure inputData is an array
  }

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name && user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const custormerGroupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên bài viết là bắt buộc')
    .min(5, 'Tên bài viết phải ít nhất 5 ký tự')
    .max(255, 'Tên bài viết không được quá 255 ký tự'),
  note: Yup.string()
    .required('Ghi chú là bắt buộc')
    .min(5, 'Ghi chú phải ít nhất 5 ký tự')
    .max(255, 'Ghi chú không được quá 255 ký tự'),
  manual: Yup.boolean().required('Manual là bắt buộc'),
  satisfy: Yup.string().when('manual', {
    is: false,
    then: (schema) => schema.required('Satisfy là bắt buộc'),
  }),
  auto: Yup.lazy((value) => {
    if (value && value.manual === false) {
      return Yup.array().of(
        Yup.object().shape({
          id: Yup.string().trim(),
          field: Yup.string().required('Trường là bắt buộc'),
          query: Yup.string().required('Điều kiện là bắt buộc'),
          status: Yup.string().required('Giá trị là bắt buộc'),
        })
      ).default([
        {
          id: '',
          field: 'Trạng thái',
          query: 'Là',
          status: 'Vui lòng chọn',
        }
      ]);
    }
    return Yup.array().of(
      Yup.object().shape({
        id: Yup.string().trim(),
        field: Yup.string().trim(),
        query: Yup.string().trim(),
        status: Yup.string().trim(),
      })
    ).default([]);
  }),
});
