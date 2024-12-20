import * as yup from 'yup'

export const productSchema = yup.object().shape({
    name: yup.string().required('Không được để trống').min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự').max(100, 'Tên sản phẩm không được quá 50 ký tự'),
    price: yup.number().required('Không được để trống').min(1, 'Giá sản phẩm phải lớn hơn 0').max(1000000000, 'Giá sản phẩm không được quá 1 tỷ'),
    quantity: yup.number().required('Không được để trống').min(1, 'Số lượng sản phẩm phải lớn hơn 0').max(1000, 'Số lượng sản phẩm không được quá 1000'),
    variantColor: yup.string().typeError('Màu sắc phải là chuỗi'),
    variantSize: yup.string().typeError('Kích thước phải là chuỗi'),
})
export const userSchema = yup.object().shape({
    name: yup.string()
        .required('Tên là bắt buộc')
        .min(2, 'Tên phải có ít nhất 2 ký tự')
        .max(50, 'Tên không được quá 50 ký tự'),
    phone: yup.string()
        .required('Số điện thoại là bắt buộc')
        .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
        .max(10, 'Số điện thoại không được quá 10 ký tự'),
});
