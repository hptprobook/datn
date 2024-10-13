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

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
export default function BlogTableRow({
  id,
  selected,
  title,
  thumbnail,
  slug,
  authName,
  onDelete,
  status,
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
  }
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={title} src={`${backendUrl}${thumbnail}`} />           
           <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{slug}</TableCell>


        <TableCell>{authName}</TableCell>

        <TableCell>
          <Label
          color={
            (status === 'public' && 'success') ||
            (status === 'private' && 'default') ||
            (status === 'waiting' && 'warning') ||
            (status === 'reject' && 'error') ||
            'default'
          }
        >
          {(status === 'public' && 'Công khai') ||
           (status === 'private' && 'Riêng tư') ||
           (status === 'waiting' && 'Chờ duyệt') ||
           (status === 'reject' && 'Từ chối') ||
           status}
          </Label>
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

BlogTableRow.propTypes = {
  id: PropTypes.any,
  thumbnail: PropTypes.any,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
  slug: PropTypes.any,
  title: PropTypes.any,
  authName: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  onDelete: PropTypes.func
};