import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { formatDateTime } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function ReceiptTableRow({
  selected,
  warehouse,
  receiptCode,
  createdAt,
  updatedAt,
  paymentMethod,
  quantity,
  total,
  handleClick,
  supplier,
  handleClickRow,
  onDelete,
}) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{
        cursor: 'pointer',
      }}
      selected={selected}
      onClick={handleClickRow}
    >
      {/* <TableCell padding="checkbox">
        <Checkbox
          disableRipple
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
        />
      </TableCell> */}

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {warehouse}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {supplier}
        </Typography>
      </TableCell>
      <TableCell>{receiptCode}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>{paymentMethod}</TableCell>
      <TableCell>{formatCurrency(total)}</TableCell>
      <TableCell>{formatDateTime(createdAt)}</TableCell>
      <TableCell>{formatDateTime(updatedAt)}</TableCell>
      <TableCell align="right">
        <IconButton onClick={handleDelete}>
          <Iconify icon="mdi:delete" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

ReceiptTableRow.propTypes = {
  warehouse: PropTypes.string,
  receiptCode: PropTypes.string,
  createdAt: PropTypes.any,
  updatedAt: PropTypes.any,
  paymentMethod: PropTypes.any,
  total: PropTypes.number,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  quantity: PropTypes.any,
  supplier: PropTypes.any,
  handleClickRow: PropTypes.func,
  onDelete: PropTypes.func,
};
