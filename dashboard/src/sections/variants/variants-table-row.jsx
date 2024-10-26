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
  onClickRow,
  onDelete,
  id,
  value,
  type,
  handleClick,
}) {
  return (
    <TableRow hover tabIndex={-1} type="checkbox" selected={selected} onClick={onClickRow}>
      <TableCell padding="checkbox">
        <Checkbox
          disableRipple
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            handleClick(id);
          }}
        />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>{type === 'color' ? 'Màu sắc' : 'Kích thước'}</TableCell>
      <TableCell align="right">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Iconify icon="eva:trash-2-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

VariantsTableRow.propTypes = {
  onClickRow: PropTypes.any,
  value: PropTypes.any,
  handleClick: PropTypes.func,
  type: PropTypes.any,
  name: PropTypes.any,
  selected: PropTypes.any,
  onDelete: PropTypes.func,
  id: PropTypes.any,
};
