import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const InputField_Full = ({
  id,
  label,
  type = 'text',
  name,
  onChange,
  onBlur,
  value,
  error,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="col-span-6 max-lg:col-span-6 md:col-span-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`pr-10 w-full rounded-md border-2 bg-white text-sm text-gray-700 shadow-sm h-10 px-3 outline-blue-500 ${
            error ? 'border-red-500' : 'border-gray-200'
          } ${disabled ? 'bg-gray-100 text-slate-400' : ''}`}
          disabled={disabled}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-2"
          >
            {showPassword ? (
              <Icon icon="mdi:eye-off" />
            ) : (
              <Icon icon="mdi:eye" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}{' '}
      {/* Display error if exists */}
    </div>
  );
};

InputField_Full.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
};

export default InputField_Full;
