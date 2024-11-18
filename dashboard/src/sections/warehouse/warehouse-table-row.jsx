import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { formatDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function WarehouseTableRow({
  selected,
  name,
  location,
  createdAt,
  updatedAt,
  currentQuantity,
  capacity,
  status,
  handleClick,
  handleNavigate,
  onDelete,
}) {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>
      <TableCell>{capacity}</TableCell>
      <TableCell>{currentQuantity}</TableCell>

      <TableCell>{status ? 'Hoạt động' : 'Không'}</TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>{formatDateTime(createdAt)}</TableCell>
      <TableCell>{formatDateTime(updatedAt)}</TableCell>
      <TableCell align="right">
        <IconButton onClick={handleNavigate}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Iconify icon="mdi:trash" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

WarehouseTableRow.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  createdAt: PropTypes.any,
  updatedAt: PropTypes.any,
  currentQuantity: PropTypes.any,
  status: PropTypes.string,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  capacity: PropTypes.any,
  handleNavigate: PropTypes.func,
  onDelete: PropTypes.func,
};
