import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Tên không được để trống')
    .required('Tên là bắt buộc'),
  location: Yup.string()
    .trim()
    .min(1, 'Địa chỉ không được để trống')
    .required('Địa chỉ là bắt buộc'),
  status: Yup.boolean()
    .required('Trạng thái là bắt buộc'),
  capacity: Yup.number()
    .integer('Sức chứa phải là số nguyên')
    .required('Sức chứa là bắt buộc'),
  currentInventory: Yup.number()
    .integer('Số lượng tồn kho phải là số nguyên')
    .default(0),
});

export const productCategories = [
  'Giày',
  'Áo',
  'Quần áo',
  'Quần',
  'Váy',
  'Túi xách',
  'Phụ kiện',
  'Đồng hồ',
  'Mắt kính',
  'Nước hoa',
  'Sandal',
  'Sản phẩm khác',
];