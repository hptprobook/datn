import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TimetableTableRow({
  selected,
  name,
  onClickRow,
  date,
  number,
  handleClick,
}) {
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      selected={selected}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
      }}
      onClick={onClickRow}
    >
      <TableCell padding="checkbox">
        <Checkbox
          disableRipple
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{date}</TableCell>

      <TableCell>{number}</TableCell>
    </TableRow>
  );
}

TimetableTableRow.propTypes = {
  date: PropTypes.any,
  handleClick: PropTypes.func,
  number: PropTypes.any,
  name: PropTypes.any,
  selected: PropTypes.any,
  onClickRow: PropTypes.func,
};
