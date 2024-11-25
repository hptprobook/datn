import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { Stack, Button, TextField } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function TableToolbar({
  numSelected,
  filterName,
  onFilterName,
  placeholderLabel,
  onExport,
}) {
  const [isExport, setIsExport] = useState(false);
  const [start, setStart] = useState(1);
  const [limit, setLimit] = useState(5);
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
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder={placeholderLabel}
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
        <Tooltip title="Xóa">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" alignItems="center" spacing={2}>
          {!isExport ? (
            <Button
              variant="contained"
              color="inherit"
              onClick={() => setIsExport(true)}
              startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
            >
              Xuất Excel
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <TextField
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="Từ"
                type="number"
                label="Từ"
                sx={{ width: 80 }}
              />
              <TextField
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Số lượng"
                label="Số lượng"
                type="number"
                sx={{ width: 80 }}
              />
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  setIsExport(false);
                  onExport({ start, limit });
                }}
                startIcon={<Iconify icon="ic:round-save" />}
              >
                Lưu
              </Button>
            </Stack>
          )}
          <Tooltip title="Lọc">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholderLabel: PropTypes.string,
  onExport: PropTypes.func,
};
