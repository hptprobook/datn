import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
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
  const handleDelete = (idDelete) => {
    onDelete(idDelete);
  };
  return (
    <TableRow
      hover
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
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
          <Avatar alt={title} src={renderUrl(image, backendUrl)} />
          <Typography variant="subtitle2" noWrap>
            {title.length > 50 ? `${title.substring(0, 50)}...` : title}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        {description.length > 50 ? `${description.substring(0, 50)}...` : description}
      </TableCell>

      <TableCell> {url.length > 50 ? `${url.substring(0, 30)}...` : url}</TableCell>

      <TableCell align="right">
        <IconButton onClick={handleNavigate}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
        <IconButton onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="mdi:trash" />
        </IconButton>
      </TableCell>
    </TableRow>
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
