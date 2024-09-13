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

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function NavTableRow({
  selected,
  title,
  icon,
  path,
  havechild,
  index,
  handleClick,
  handleDelete,
  handleUpdate
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleRemove = () => {
    handleDelete();
    handleCloseMenu();
  }
  const openUpdate = () => {
    handleUpdate();
    handleCloseMenu();
  }
  return (
    <>
      <TableRow hover tabIndex={-1} havechild="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon={icon} width={20} height={20} />
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{index}</TableCell>
        <TableCell align="center">{havechild ? 'Có' : 'Không'}</TableCell>

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
        <MenuItem onClick={openUpdate}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Sửa
        </MenuItem>

        <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }} >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

NavTableRow.propTypes = {
  icon: PropTypes.any,
  path: PropTypes.any,
  handleClick: PropTypes.func,
  title: PropTypes.any,
  havechild: PropTypes.any,
  selected: PropTypes.any,
  index: PropTypes.number,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func
};
