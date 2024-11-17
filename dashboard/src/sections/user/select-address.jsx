import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function CountrySelect({ data, query, label = 'Lựa chọn', onSelect }) {
  const [selectedValue, setSelectedValue] = React.useState(null);

  // Handle selection change
  const handleChange = (event, value) => {
    setSelectedValue(value); // Update the selected value
    onSelect(value); // Call the onSelect function
  };

  // Reset selection when data changes
  React.useEffect(() => {
    setSelectedValue(null); // Clear the selected value when the data changes
  }, [data]);

  return (
    <Autocomplete
      id={query}
      options={data}
      autoHighlight
      value={selectedValue} // Controlled selected value
      getOptionLabel={(option) => (option ? option[query] : '')} // Handle null value case
      onChange={handleChange} // Attach the handleChange function
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {option[query]}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotprops={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password', // Disable autocomplete
            },
          }}
        />
      )}
    />
  );
}

CountrySelect.propTypes = {
  data: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  label: PropTypes.string,
  key: PropTypes.string,
  onSelect: PropTypes.func.isRequired, // Ensure onSelect is required
};
