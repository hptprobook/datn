import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

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

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedParentId(selectedValue);
    handleFilterChange(selectedValue);
  };

  useEffect(() => {
    handleFilterChange(selectedParentId);
  }, [selectedParentId, handleFilterChange]);


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
        <FormControl variant="outlined" size="small" sx={{ width: 300 }}>
          <InputLabel id="parent-select-label">Chọn danh mục cha</InputLabel>
          <Select
            labelId="parent-select-label"
            value={selectedParentId}
            onChange={handleSelectChange}
            label="Chọn danh mục cha"
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {dataCategories && dataCategories.length > 0 ? (
              dataCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                Không có dữ liệu
              </MenuItem>
            )}
          </Select>
        </FormControl>
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
