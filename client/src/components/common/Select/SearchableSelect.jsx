import PropTypes from 'prop-types';
import Select from 'react-select';

const SearchableSelect = ({
  id,
  label,
  name,
  options,
  onChange,
  error,
  value,
  defaultValue,
  isSearchable = true,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
  ...rest
}) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f87171' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: '#fecaca',
        color: '#000000',
      },
    }),
    control: (provided) => ({
      ...provided,
      borderColor: error ? '#f87171' : '#d1d5db',
    }),
  };

  return (
    <div className='w-full'>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        {label}
      </label>
      <Select
        id={id}
        name={name}
        value={
          value
            ? options.find((option) => getOptionValue(option) === value)
            : null
        }
        defaultValue={defaultValue}
        onChange={onChange}
        options={options}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        classNamePrefix='react-select'
        isSearchable={isSearchable}
        styles={customStyles}
        className={`w-full rounded-md text-sm h-10 ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        noOptionsMessage={() => 'Không tìm thấy'}
        {...rest}
      />
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

SearchableSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isSearchable: PropTypes.bool,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
};

export default SearchableSelect;
