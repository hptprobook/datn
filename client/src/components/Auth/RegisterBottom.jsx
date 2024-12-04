import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RegisterBottom = ({ checked, onChange }) => {
  return (
    <div className="col-span-6">
      {/* Checkbox section */}
      <div className="col-span-6 mb-4">
        <label htmlFor="allowNotifies" className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowNotifies"
            name="allowNotifies"
            checked={checked}
            onChange={onChange}
            className="rounded border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-700">
            Tôi muốn nhận email về các sự kiện, cập nhật sản phẩm và các thông
            báo của cửa hàng.
          </span>
        </label>
      </div>

      {/* Terms and Privacy Policy */}
      <div className="col-span-6">
        <p className="text-sm text-gray-500">
          Bằng việc tạo một tài khoản, tôi đồng ý với{' '}
          <Link
            to={'/static/dieu-kien-dieu-khoan'}
            className="text-blue-700 underline hover:text-red-500 transition-colors duration-300"
          >
            các điều khoản - điều kiện
          </Link>{' '}
          và{' '}
          <Link
            to={'/static/chinh-sach-bao-mat'}
            className="text-blue-700 underline hover:text-red-500 transition-colors duration-300"
          >
            chính sách bảo mật
          </Link>
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
