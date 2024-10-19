import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CategoryTableToolbar({ numSelected, filterName, onFilterName, onMultiDelete, handleFilterChange, dataCategories }) {

 
  const [selectedParentId, setSelectedParentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectChange = (event, newValue) => {
    const selectedValue = newValue ? newValue._id : '';
    setSelectedParentId(selectedValue);
    handleFilterChange(selectedValue);
  };

  
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };
  useEffect(() => {
    handleFilterChange(selectedParentId);
  }, [selectedParentId, handleFilterChange]);

  const filteredCategories = dataCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} lựa chọn
        </Typography>
      ) : (

        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Tìm kiếm Danh mục ..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }

        />


      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onMultiDelete}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Autocomplete
            options={filteredCategories}
            getOptionLabel={(option) => option.name}
            onChange={handleSelectChange}
            renderInput={(params) => (
              <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Chọn danh mục cha"
              onChange={handleSearchChange} 
              sx={{ width: 300 }}
              />
            )}
            sx={{ width: 300 }}
          />
      )}
    </Toolbar>
  );
}

CategoryTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onMultiDelete: PropTypes.func,
  dataCategories: PropTypes.array,
  handleFilterChange: PropTypes.func
};
