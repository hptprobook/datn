import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VariantsTableRow({
  selected,
  name,
  handleNavigate,
  onDelete,
  id,
  value,
  createdAt,
  type,
  updatedAt,
  handleClick,
}) {
  return (
    <TableRow hover tabIndex={-1} createdAt="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{value}</TableCell>

      <TableCell>{type}</TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell>{updatedAt}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onDelete(id)}>
          <Iconify icon="eva:trash-2-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

VariantsTableRow.propTypes = {
  handleNavigate: PropTypes.any,
  value: PropTypes.any,
  handleClick: PropTypes.func,
  type: PropTypes.any,
  name: PropTypes.any,
  createdAt: PropTypes.any,
  selected: PropTypes.any,
  updatedAt: PropTypes.string,
  onDelete: PropTypes.func,
  id: PropTypes.any,
};
