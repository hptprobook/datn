import * as Yup from 'yup';

export const navSchema = Yup.object().shape({
    path: Yup.string()
        .required('Đường dẫn là bắt buộc')
        .typeError('Đường dẫn phải là chuỗi')
        .min(2, 'Đường dẫn phải có ít nhất 2 ký tự')
        .max(60, 'Đường dẫn không được quá 60 ký tự'),
    title: Yup.string()
        .required('Tên menu là bắt buộc')
        .typeError('Tên menu phải là chuỗi')
        .min(2, 'Tên menu phải có ít nhất 2 ký tự')
        .max(60, 'Tên menu không được quá 60 ký tự'),
    index: Yup.number()
        .required('Vị trí là bắt buộc')
        .integer('Vị trí phải là số nguyên')
        .min(0, 'Vị trí phải lớn hơn hoặc bằng 0')
        .max(100, 'Vị trí không được quá 100'),
});
export const navSchemaItem = Yup.object().shape({
    path: Yup.string()
        .required('Đường dẫn là bắt buộc')
        .typeError('Đường dẫn phải là chuỗi')
        .min(2, 'Đường dẫn phải có ít nhất 2 ký tự')
        .max(60, 'Đường dẫn không được quá 60 ký tự'),
    title: Yup.string()
        .required('Tên menu là bắt buộc')
        .typeError('Tên menu phải là chuỗi')
        .min(2, 'Tên menu phải có ít nhất 2 ký tự')
        .max(60, 'Tên menu không được quá 60 ký tự'),
});