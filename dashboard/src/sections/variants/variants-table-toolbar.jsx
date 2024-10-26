import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function VariantsTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onFilterType,
  onDeleteMany,
}) {
  const [type, setType] = useState('');
  const handleChange = (event) => {
    setType(event.target.value);
    onFilterType(event.target.value);
  };
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
          {numSelected} được chọn
        </Typography>
      ) : (
        <Stack spacing={2} direction="row">
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Tìm kiếm biến thể..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <FormControl fullWidth>
            <InputLabel id="filter-type-select-label">Loại</InputLabel>
            <Select
              labelId="filter-type-select-label"
              id="filter-type-select"
              value={type}
              label="Loại"
              onChange={handleChange}
            >
              <MenuItem value="color">Màu</MenuItem>
              <MenuItem value="size">Kích thước</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton onClick={() => onDeleteMany()}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

VariantsTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteMany: PropTypes.func,
  onFilterType: PropTypes.func,
};
