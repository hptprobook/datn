import PropTypes from 'prop-types';

const RegisterBottom = ({ checked, onChange }) => {
  return (
    <div>
      <div className="col-span-6">
        <label htmlFor="allowNotifies" className="flex gap-4">
          <input
            type="checkbox"
            id="allowNotifies"
            name="allowNotifies"
            checked={checked}
            onChange={onChange}
            className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
          />

          <span className="text-sm text-gray-700">
            Tôi muốn nhận email về các sự kiện, cập nhật sản phẩm và các thông
            báo của cửa hàng.
          </span>
        </label>
      </div>

      <div className="col-span-6">
        <p className="text-sm text-gray-500">
          Bằng việc tạo một tài khoản, tôi đồng ý với{' '}
          <a href="#" className="text-gray-700 underline hover:text-red-500">
            các điều khoản - điều kiện
          </a>{' '}
          và{' '}
          <a href="#" className="text-gray-700 underline hover:text-red-500">
            chính sách bảo mật
          </a>
          .
        </p>
      </div>
    </div>
  );
};

RegisterBottom.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RegisterBottom;
