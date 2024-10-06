import InputField_Full from '~/components/common/TextField/InputField_Full';
import UploadImage from '~/components/common/UploadImage/UploadImage';

const MyProfile = () => {
  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold border-b pb-3">Hồ sơ của tôi</h1>
      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="col-span-4">
          <UploadImage />
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="border-l h-full border-gray-300"></div>
        </div>

        <div className="col-span-7 no-gu">
          <div>
            <div>
              <InputField_Full
                id="fullName"
                label="Họ và tên"
                name="fullName"
                type="text"
              />
            </div>
            <div className="mt-2">
              <InputField_Full
                id="birthday"
                label="Ngày sinh"
                name="birthday"
                type="date"
              />
            </div>
            <div id="gender" className="mt-2 text-sm font-medium text-gray-700">
              <h3 className="">Giới tính</h3>

              <div className="flex gap-6 my-3">
                <label className="flex cursor-pointer gap-2 items-center">
                  <input
                    type="radio"
                    className="radio bg-white"
                    name="gender"
                  />
                  <span>Nam</span>
                </label>

                <label className="flex cursor-pointer gap-2 items-center">
                  <input
                    type="radio"
                    className="radio bg-white"
                    name="gender"
                  />
                  <span>Nữ</span>
                </label>

                <label className="flex cursor-pointer gap-2 items-center">
                  <input
                    type="radio"
                    className="radio bg-white"
                    name="gender"
                  />
                  <span>Khác</span>
                </label>
              </div>
            </div>
            <div className="mt-2">
              <InputField_Full
                id="phone"
                label="Số điện thoại"
                name="phone"
                type="text"
              />
            </div>
            <div className="mt-2">
              <InputField_Full
                id="email"
                label="Email"
                name="email"
                type="email"
              />
            </div>
            <div className="mt-4">
              <button className="btn btn-error float-end rounded-md">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MyProfile.propTypes = {};

export default MyProfile;
