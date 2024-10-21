import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import {
  Card,
  Stack,
  Button,
  CardMedia,
  IconButton,
  Typography,
  CardActions,
  CardContent,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default function StaffModal({ open, handleClose, staff, handleAction }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ ...style }}>
        <Card sx={{ padding: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
            <Typography variant="h6">Chi tiết nhân viên</Typography>
            <IconButton onClick={handleClose}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CardMedia
              height={140}
              sx={{ width: 140 }}
              component="img"
              image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {staff?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Mã nhân viên: {staff?.staffCode || 'Chưa cập nhật'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Vai trò: <Label color="success">{staff?.role}</Label>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Email: {staff?.email}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Số điện thoại: {staff?.phone || 'Chưa cập nhật'}
              </Typography>
            </CardContent>
          </Stack>
          <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Chi nhánh: {staff?.branchId || 'Chưa cập nhật'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Đia chỉ: {staff?.address || 'Chưa cập nhật'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Mức lương: {formatCurrency(staff?.salary) || 'Chưa cập nhật'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Kiểu lương: {staff?.salaryType || 'Chưa cập nhật'}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <Button size="small" onClick={() => handleAction('delete', staff._id)} color="error">
              Xóa
            </Button>
            <Button
              size="small"
              onClick={() => handleAction('edit', staff._id)}
              color="inherit"
              variant="contained"
            >
              Chỉnh sửa
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
}
StaffModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  staff: PropTypes.object,
  handleAction: PropTypes.func,
};
