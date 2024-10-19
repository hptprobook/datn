import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export const AutoSelect = ({ value, setValue, data, label, error }) => (
  <Autocomplete
    multiple
    limitTags={2}
    value={value}
    onChange={(event, newValue) => {
      setValue(newValue);
    }}
    id="product-supplier-select"
    options={data}
    getOptionLabel={(option) => option}
    renderInput={(params) => (
      <TextField error={error} {...params} label={label} placeholder={`${label}...`} />
    )}
    sx={{ width: '100%' }}
  />
);
AutoSelect.propTypes = {
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
};
