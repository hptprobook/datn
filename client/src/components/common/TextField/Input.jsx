import PropTypes from 'prop-types';

const Input = ({
  id,
  type = 'text',
  label,
  placeholder = label,
  isRequire = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {label}
        {isRequire ? ' *' : ''}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`block w-full rounded-md border p-2 text-sm ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
        } focus:border-primary-500 focus:ring-primary-500`}
        placeholder={placeholder}
        required={isRequire}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequire: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
};

export default Input;
