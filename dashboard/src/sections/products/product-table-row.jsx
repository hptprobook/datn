import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';
import { renderStatusStock } from 'src/utils/format-text';

const backendUrl  = import.meta.env.VITE_BACKEND_APP_URL;

export default function ProductTableRow({
  selected,
  _id,
  name,
  imgURLs,
  slug,
  averageRating,
  price,
  brand,
  statusStock,
  handleClick,
  onDelete,
  handleNavigate,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    onDelete();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={renderUrl(imgURLs, backendUrl)} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{slug}</TableCell>
        <TableCell>{formatCurrency(price)}</TableCell>

        <TableCell>{brand}</TableCell>
        <TableCell>{averageRating}</TableCell>
        <TableCell>{renderStatusStock(statusStock)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleNavigate}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

ProductTableRow.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
  imgURLs: PropTypes.string,
  price: PropTypes.number,
  brand: PropTypes.string,
  statusStock: PropTypes.string,
  averageRating: PropTypes.number,
  slug: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
  onDelete: PropTypes.func,
  handleNavigate: PropTypes.func,
};