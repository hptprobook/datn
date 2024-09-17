import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify/iconify';
import { useRouter } from 'src/routes/hooks';
import { statusConfig, paymentConfig } from './utils';
// ----------------------------------------------------------------------

export default function OrderTableRow({
  id,
  selected,
  name,
  totalAmount,
  userId,
  paymentMethod,
  status,
  handleClick,
}) {
  const newStatus = status[status.length - 1].status;
const router = useRouter();
  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{userId}</TableCell>

      <TableCell>{paymentConfig[paymentMethod].label}</TableCell>

      <TableCell align="center">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
      </TableCell>

      <TableCell>
        <Label color={statusConfig[newStatus].color}>{statusConfig[newStatus].label}</Label>
      </TableCell>

      <TableCell align="right">
        <IconButton onClick={() => router.push(id)}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

OrderTableRow.propTypes = {
  id: PropTypes.any,
  totalAmount: PropTypes.any,
  handleClick: PropTypes.func,
  paymentMethod: PropTypes.any,
  name: PropTypes.any,
  userId: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.array,
};
