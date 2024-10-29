import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CouponTableRow({
  selected,
  id,
  code,
  type,
  minPurchasePrice,
  maxPurchasePrice,
  usageLimit,
  usageCount,
  status,
  limitOnUser,
  dateStart,
  dateEnd,
  onDelete,
  handleClick,
  handleNavigate,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = (idDelete) => {
    onDelete(idDelete);
    handleCloseMenu();
  }
  const statusMapping = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    expired: 'Hết hạn',
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {code}
          </Typography>
        </TableCell>

        <TableCell>

          {(type === 'percent' && 'Phần trăm') ||
            (type === 'price' && 'Giá tiền') ||
            (type === 'shipping' && 'Phí ship') ||
            type}

        </TableCell>

        <TableCell>{minPurchasePrice}</TableCell>

        <TableCell>{maxPurchasePrice}</TableCell>

        <TableCell>{usageLimit}</TableCell>

        <TableCell>{usageCount}</TableCell>

        <TableCell>
          <Label
            color={
              (status === 'expired' && 'error') || (status === 'inactive' && 'warning') || 'success'
            }
          >
            {statusMapping[status] || status}
          </Label>
        </TableCell>

        <TableCell>{limitOnUser ? 'Có' : 'Không'}</TableCell>

        <TableCell>{new Date(dateStart).toLocaleDateString()}</TableCell>

        <TableCell>{new Date(dateEnd).toLocaleDateString()}</TableCell>

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
          Xem
        </MenuItem>

        <MenuItem onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

CouponTableRow.propTypes = {
  id: PropTypes.any,
  onDelete: PropTypes.func,
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  minPurchasePrice: PropTypes.number.isRequired,
  maxPurchasePrice: PropTypes.number.isRequired,
  usageLimit: PropTypes.number.isRequired,
  usageCount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  limitOnUser: PropTypes.bool.isRequired,
  dateStart: PropTypes.any.isRequired,
  dateEnd: PropTypes.any.isRequired,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
};
