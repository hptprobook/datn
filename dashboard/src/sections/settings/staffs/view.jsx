import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
  List,
  Avatar,
  Button,
  ListItem,
  IconButton,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';
import { fetchAllStaffs } from 'src/redux/slices/staffSlices';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import { useNavigate } from 'react-router-dom';
import StaffTable from '../staff-table';
// ----------------------------------------------------------------------

export default function StaffsPage() {
  const dispatch = useDispatch();
  const [staffs, setStaffs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const statusGet = useSelector((state) => state.staffs.status);
  const statusCreate = useSelector((state) => state.staffs.statusCreate);
  const statusUpdate = useSelector((state) => state.staffs.statusUpdate);
  const statusDelete = useSelector((state) => state.staffs.statusDelete);
  const error = useSelector((state) => state.staffs.error);
  const data = useSelector((state) => state.staffs.staffs);
  useEffect(() => {
    dispatch(fetchAllStaffs());
  }, [dispatch]);
  useEffect(() => {
    if (statusGet === 'successful') {
      const dataAdmin = data.filter((staff) => staff.role === 'admin' || staff.role === 'root');
      setAdmins(dataAdmin);
      const dataStaff = data.filter((staff) => staff.role === 'staff' || staff.role === 'ban');
      setStaffs(dataStaff);
    }
  }, [statusGet, data]);
  return (
    <Container>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">Quản lý nhân viên</Typography>
          <IconButton onClick={() => console.log(1)}>
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Card
          sx={{
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Danh sách quản lý</Typography>
          <List>
            {admins.map((item) => (
              <ListItem key={item._id}>
                <ListItemAvatar>
                  <Avatar>
                    <Iconify icon="eva:person-fill" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Đăng nhập lần cuối lúc: ${formatDateTime(item.lastLogin)}`}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Label color="success">{item.role === 'root' ? 'Chủ cửa hàng' : 'Quản lý'}</Label>
                  <Label color="success">{item.branchId}</Label>
                  <IconButton>
                    <Iconify icon="mdi:delete" />
                  </IconButton>
                  <IconButton>
                    <Iconify icon="mdi:account-edit" />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card
          sx={{
            p: 2,
            borderRadius: 1,
          }}
        >
          <Stack justifyContent="space-between" direction="row" mb={2}>
            <Typography variant="h6">Danh sách nhân viên</Typography>
            <Button variant="contained" color="inherit" onClick={() => navigate('create')}>
              Thêm nhân viên
            </Button>
          </Stack>
          <StaffTable data={staffs} />
        </Card>
      </Stack>
    </Container>
  );
}
