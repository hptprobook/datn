import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser, updateInfor } from '~/APIs/user';
import InputField_Full from '~/components/common/TextField/InputField_Full';
import UploadImage from '~/components/common/UploadImage/UploadImage';
import { Datepicker } from 'flowbite-react';
import moment from 'moment/moment';
import MainLoading from '~/components/common/Loading/MainLoading';
import { useSwal } from '~/customHooks/useSwal';
import { env } from '~/utils/constants';

const MyProfile = () => {
  const {
    data: user,
    refetch: refetchUser,
    isLoading,
  } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: getCurrentUser,
  });

  const mutation = useMutation({
    mutationFn: updateInfor,
    onSuccess: () => {
      refetchUser();
      useSwal.fire({
        title: 'Thành công!',
        text: 'Cập nhật thông tin thành công',
        icon: 'success',
      });
    },
    onError: () => {
      useSwal.fire({
        title: 'Thất bại!',
        text: 'Cập nhật thông tin thất bại, vui lòng thử lại!',
        icon: 'error',
      });
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      birthdate: user?.birthdate || null,
      gender: user?.gender || 'male',
      phone: user?.phone || '',
      avatar:
        user?.avatar &&
        !user?.avatar.startsWith('http://') &&
        !user?.avatar.startsWith('https://')
          ? `${env.SERVER_URL}/${user?.avatar}`
          : user?.avatar,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Họ là bắt buộc')
        .min(2, 'Họ phải có ít nhất 2 ký tự')
        .max(100, 'Họ không được vượt quá 100 ký tự')
        .matches(
          /^[a-zA-ZÀ-ỹ\s]+$/,
          'Họ không được chứa ký tự đặc biệt hoặc số'
        ),
      birthdate: Yup.date()
        .required('Ngày sinh không được bỏ trống')
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() - 6)),
          'Tuổi phải từ 6 trở lên'
        )
        .min(
          new Date(new Date().setFullYear(new Date().getFullYear() - 120)),
          'Tuổi không được quá 120'
        ),
      phone: Yup.string()
        .required('Số điện thoại không được để trống')
        .matches(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Số điện thoại không hợp lệ'),
      avatar: Yup.mixed().test(
        'fileOrUrl',
        'Ảnh không hợp lệ. Chỉ chấp nhận file JPG, JPEG, PNG hoặc đường dẫn URL hợp lệ',
        async (value) => {
          if (!value) return true;

          if (typeof value === 'string') {
            return /^https?:\/\//.test(value);
          }

          if (value instanceof File) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            // Kiểm tra MIME type và kích thước
            if (
              !validTypes.includes(value.type) ||
              value.size > 1024 * 1024 * 3
            ) {
              return false;
            }

            // Kiểm tra signature của file
            try {
              const arrayBuffer = await value.slice(0, 4).arrayBuffer();
              const bytes = new Uint8Array(arrayBuffer);
              const signatures = {
                // PNG signature
                png: [0x89, 0x50, 0x4e, 0x47],
                // JPEG signatures
                jpeg: [0xff, 0xd8, 0xff],
              };

              // Kiểm tra PNG
              if (value.type === 'image/png') {
                return bytes.every((byte, i) => byte === signatures.png[i]);
              }

              // Kiểm tra JPEG/JPG
              if (value.type.includes('jpeg') || value.type.includes('jpg')) {
                return (
                  bytes[0] === signatures.jpeg[0] &&
                  bytes[1] === signatures.jpeg[1] &&
                  bytes[2] === signatures.jpeg[2]
                );
              }
            } catch (error) {
              return false;
            }
          }
          return false;
        }
      ),
    }),

    onSubmit: async (values) => {
      const timestampBirthdate = values.birthdate
        ? new Date(values.birthdate).toISOString()
        : null;

      const data = {
        ...values,
        birthdate: timestampBirthdate,
        avatar: formik.values.avatar,
      };

      mutation.mutate(data);
    },
  });

  const handleAvatarChange = (file) => {
    formik.setFieldValue('avatar', file);
  };

  if (isLoading) {
    return <MainLoading />;
  }

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold border-b pb-3">Hồ sơ của tôi</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-2 mt-4">
          <div className="col-span-4 max-lg:col-span-12">
            <UploadImage
              onFileSelect={handleAvatarChange}
              avatar={user?.avatar}
            />
          </div>

          <div className="col-span-1 flex justify-center max-lg:col-span-12">
            <div className="border-l h-full border-gray-300"></div>
          </div>

          <div className="col-span-7 no-gu max-lg:col-span-12">
            <InputField_Full
              id="name"
              label="Họ và tên"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
            />
            <div className="mt-2">
              <InputField_Full
                id="email"
                label="Email"
                name="email"
                type="email"
                value={user?.email}
                disabled
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ngày sinh
              </label>
              <Datepicker
                id="birthdate"
                label="Ngày sinh"
                name="birthdate"
                language="vi"
                selected={formik.values.birthdate}
                onSelectedDateChanged={(date) =>
                  formik.setFieldValue('birthdate', date)
                }
                defaultValue={user?.birthdate}
                value={
                  formik.values.birthdate
                    ? moment(formik.values.birthdate).format('DD-MM-YYYY')
                    : moment(user?.birthdate).format('DD-MM-YYYY')
                }
                dateFormat="dd-MM-yyyy"
                className="w-full"
              />
              {formik.touched.birthdate && formik.errors.birthdate && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.birthdate}
                </p>
              )}
            </div>
            <div id="gender" className="mt-2 text-sm font-medium text-gray-700">
              <h3 className="">Giới tính</h3>

              <div className="flex gap-6 my-3">
                {['male', 'female', 'other'].map((gender) => (
                  <label
                    key={gender}
                    className="flex cursor-pointer gap-2 items-center"
                  >
                    <input
                      type="radio"
                      className="radio bg-white"
                      name="gender"
                      value={gender}
                      checked={formik.values.gender === gender}
                      onChange={formik.handleChange}
                    />
                    <span>
                      {gender === 'male'
                        ? 'Nam'
                        : gender === 'female'
                        ? 'Nữ'
                        : 'Khác'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <InputField_Full
                id="phone"
                label="Số điện thoại"
                name="phone"
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && formik.errors.phone}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn text-white bg-red-600 float-end rounded-md"
                disabled={mutation.isLoading || !formik.dirty}
              >
                {mutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
