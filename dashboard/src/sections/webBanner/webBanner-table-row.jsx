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
import { Stack, Avatar } from '@mui/material';
import { renderUrl } from 'src/utils/check';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

export default function WebBannerTableRow({
  selected,
  onClick,
  id,
  title,
  description,
  url,
  image,
  onDelete,
  handleClick,
  handleNavigate,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    event.stopPropagation();
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
      <TableRow hover
        onClick={onClick}
        sx={{ cursor: 'pointer' }}
        tabIndex={-1}
        role="checkbox"
        selected={selected}>
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
            <Avatar alt={title} src={renderUrl(image, backendUrl)} />
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          {description}

        </TableCell>

        <TableCell>{url}</TableCell>


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

WebBannerTableRow.propTypes = {
  id: PropTypes.any,
  onDelete: PropTypes.func,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
  onClick: PropTypes.func,
};
