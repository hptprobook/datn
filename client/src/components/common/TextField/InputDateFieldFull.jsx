import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '~/utils/formatters';

const InputDateField_Full = ({
  id,
  label,
  name,
  onChange,
  onBlur,
  value,
  error,
  disabled,
}) => {
  // Format the value into dd/mm/yyyy when component mounts or value changes
  const [internalValue, setInternalValue] = useState('');

  useEffect(() => {
    if (value) {
      setInternalValue(formatDateToDDMMYYYY(value));
    }
  }, [value]);

  const handleInputChange = (e) => {
    const formattedValue = e.target.value;
    setInternalValue(formattedValue);

    const convertedValue = formatDateToYYYYMMDD(formattedValue);
    onChange({
      target: {
        name,
        value: convertedValue,
      },
    });
  };

  return (
    <div className="col-span-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder="dd/mm/yyyy"
          className={`pr-10 w-full rounded-md border-2 bg-white text-sm text-gray-700 shadow-sm h-10 px-3 outline-blue-500 ${
            error ? 'border-red-500' : 'border-gray-200'
          } ${disabled ? 'bg-gray-100 text-slate-400' : ''}`}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

InputDateField_Full.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputDateField_Full;
