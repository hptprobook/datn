import InputField_Full from '~/components/common/TextField/InputField_Full';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { changePassWord } from '~/APIs';
import { useSwal } from '~/customHooks/useSwal';

const validationSchema = Yup.object({
  password: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu mới'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

const ChangePassword = () => {
  const { mutate } = useMutation({
    mutationFn: changePassWord,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Thay đổi mật khẩu thành công!',
        confirmButtonText: 'Xác nhận',
      });
    },
    onError: (error) => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: error.message,
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        password: values.password,
        newPassword: values.newPassword,
      });
    },
  });

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">ĐỔI MẬT KHẨU</h1>
      <form onSubmit={formik.handleSubmit} className="mt-12 grid gap-6">
        <InputField_Full
          id="password"
          label="Mật khẩu cũ"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.touched.password && formik.errors.password}
        />
        <InputField_Full
          id="newPassword"
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          error={formik.touched.newPassword && formik.errors.newPassword}
        />
        <InputField_Full
          id="confirmPassword"
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <button
          type="submit"
          className="btn bg-red-600 rounded-md hover:bg-red-700"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

ChangePassword.propTypes = {};

export default ChangePassword;
