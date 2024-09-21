import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SupplierTableRow({
  selected,
  companyName,
  fullName,
  phone,
  email,
  registrationNumber,
  website,
  rating,
  handleClick,
  handleNavigate,
  onDelete,
}) {
  const [open, setOpen] = useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleDelete = () => {
    onDelete();
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {companyName}
          </Typography>
        </TableCell>

        <TableCell>{fullName}</TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{registrationNumber}</TableCell>

        <TableCell>{website}</TableCell>

        <TableCell>{rating}</TableCell>

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

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

SupplierTableRow.propTypes = {
  companyName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  registrationNumber: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
  onDelete: PropTypes.func,
};
