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
  isSearchable = true,
  ...rest
}) => {
  // Custom styles for react-select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f87171' : '#ffffff', // màu đỏ khi được chọn
      color: state.isSelected ? '#ffffff' : '#000000', // màu chữ khi chọn
      '&:hover': {
        backgroundColor: '#fecaca', // màu đỏ nhạt khi hover
        color: '#000000', // màu chữ khi hover
      },
    }),
    control: (provided) => ({
      ...provided,
      borderColor: error ? '#f87171' : '#d1d5db', // màu viền tùy thuộc vào trạng thái lỗi
    }),
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <Select
        id={id}
        name={name}
        value={options.find((option) => option.value === value)}
        onChange={onChange}
        options={options}
        classNamePrefix="react-select"
        isSearchable={isSearchable}
        styles={customStyles}
        className={`w-full rounded-md text-sm h-10 ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        noOptionsMessage={() => 'Không tìm thấy'}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

SearchableSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.string,
  isSearchable: PropTypes.bool,
};

export default SearchableSelect;
