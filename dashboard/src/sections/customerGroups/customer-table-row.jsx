import { useState } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { Box } from '@mui/material';


export default function CustomerGroupTableRow({
  id,
  selected,
  name,
  phone,
  email,
  onDelete,
  handleClick,
  handleNavigate
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
  };
  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onClick={(event) => event.stopPropagation()}
            onChange={handleClick}
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Typography variant="subtitle2" noWrap>
              {phone}
            </Typography>
          </Box>
        </TableCell>
      

        <TableCell>
        {email}
        </TableCell>
       


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

        <MenuItem onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

CustomerGroupTableRow.propTypes = {
  id: PropTypes.any,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
  selected: PropTypes.any,
  name: PropTypes.any,
  phone: PropTypes.any,
  email: PropTypes.any,
  onDelete: PropTypes.func
};