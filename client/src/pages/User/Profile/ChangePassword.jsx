import InputField_Full from '~/components/common/TextField/InputField_Full';

const ChangePassword = () => {
  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">ĐỔI MẬT KHẨU</h1>
      <form className="mt-12 grid gap-6">
        <InputField_Full
          id="oldPassword"
          label="Mật khẩu cũ"
          name="oldPassword"
          type="password"
        />
        <InputField_Full
          id="newPassword"
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
        />
        <InputField_Full
          id="confirmPassword"
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          type="password"
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
