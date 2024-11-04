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
  capacity: Yup.number()
    .integer('Sức chứa phải là số nguyên')
    .required('Sức chứa là bắt buộc'),
    currentQuantity: Yup.number()
    .integer('Số lượng tồn kho phải là số nguyên')
    .default(0),
});
