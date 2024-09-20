import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function ProductSupplierSelect({ value, setValue }) {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      id="product-supplier-select"
      options={products}
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField {...params} label="Sản phẩm cung cấp" placeholder="Sản phẩm cung cấp..." />
      )}
      sx={{ width: '100%' }}
    />
  );
}
ProductSupplierSelect.propTypes = {
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
};

const products = [
  'Giày',
  'Áo',
  'Quần',
  'Váy',
  'Túi xách',
  'Phụ kiện',
  'Đồng hồ',
  'Mắt kính',
  'Nước hoa',
  'Sản phẩm khác',
];
