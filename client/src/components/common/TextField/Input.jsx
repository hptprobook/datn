import PropTypes from 'prop-types';

const Input = ({
  id,
  type = 'text',
  label,
  placeholder = label,
  isRequire = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {' '}
        {label}
        {isRequire ? ' *' : ''}{' '}
      </label>
      <input
        type={type}
        id={id}
        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  isRequire: PropTypes.bool,
};

export default Input;
