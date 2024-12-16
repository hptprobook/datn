import {
  Box,
  alpha,
  Stack,
  Toolbar,
  Tooltip,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  TableSortLabel,
} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

export const renderSalaryType = (type) => {
  switch (type) {
    case 'hourly':
      return 'Theo giờ';
    case 'daily':
      return 'Theo ngày';
    case 'monthly':
      return 'Theo tháng';
    case 'product':
      return 'Theo sản phẩm';
    case 'contract':
      return 'Hợp đồng';
    case 'customer':
      return 'Theo khách hàng';
    default:
      return '';
  }
};
export const salaryType = ['hourly', 'daily', 'monthly', 'product', 'contract', 'customer'];
export const renderRole = (role) => {
  switch (role) {
    case 'root':
      return 'Chủ cửa hàng';
    case 'admin':
      return 'Quản lý';
    case 'staff':
      return 'Nhân viên';
    case 'ban':
      return 'Bị cấm';
    default:
      return '';
  }
};
export const EnhancedTableHead = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'action' ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};
export const EnhancedTableToolbar = ({ numSelected, onSearch, label, onDelete }) => (
  <Toolbar
    sx={[
      {
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      },
      numSelected > 0 && {
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      },
    ]}
  >
    {numSelected > 0 ? (
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
        {numSelected} lựa chọn
      </Typography>
    ) : (
      <Stack direction="row" sx={{ flex: '1 1 100%' }} spacing={1} justifyContent="space-between">
        <Typography
          variant="p"
          id="tableTitle"
          sx={{
            fontWeight: 'bold',
          }}
        >
          {label || 'Danh sách'}
        </Typography>
        <TextField
          size="small"
          placeholder="Tìm kiếm"
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    )}

    {numSelected > 0 && (
      <Tooltip title="Xóa">
        <IconButton onClick={() => onDelete()}>
          <Iconify icon="eva:trash-fill" />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
);

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSearch: PropTypes.func,
  label: PropTypes.string,
  onDelete: PropTypes.func,
};
export const staticPageType = {
  about: 'Giới thiệu',
  commit: 'Cam kết',
  storeSystem: 'Hệ thống cửa hàng',
  orderHelp: 'Hướng dẫn đặt hàng',
  paymentMethod: 'Phương thức thanh toán',
  membershipPolicy: 'Chính sách thành viên',
  pointsPolicy: 'Chính sách tích - tiêu điểm',
  shippingPolicy: 'Chính sách vận chuyển',
  inspectionPolicy: 'Chính sách kiểm hàng',
  returnPolicy: 'Chính sách đổi trả',
  termsConditions: 'Điều kiện & Điều khoản',
  privacyPolicy: 'Chính sách bảo mật',
};
