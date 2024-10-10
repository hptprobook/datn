import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Tên không được để trống') // equivalent to `string.empty`
    .required('Tên là bắt buộc'),       // equivalent to `any.required`

  slug: Yup.string()
    .trim()
    .min(1, 'Slug không được để trống')  // equivalent to `string.empty`
    .required('Slug là bắt buộc'),       // equivalent to `any.required`
  website: Yup.string()
    .trim()
    .max(255, 'Website không được quá 255 ký tự')
    .url('Website không hợp lệ'),       
  category: Yup.string()
    .trim()
    .default('Quần áo'),              

  description: Yup.string()
    .trim()
    .min(1, 'Nội dung không được để trống')  // equivalent to `string.empty`
    .required('Nội dung là bắt buộc'),       // equivalent to `any.required`

  status: Yup.boolean()
    .default(true)  // sets the default value
    .typeError('Trạng thái phải là Đúng/Sai'),  // equivalent to `boolean.base`
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