import {
  Card,
  Stack,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormHelpTextError from 'src/components/errors/form-error';
import Iconify from 'src/components/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, createStaff } from 'src/redux/slices/staffSlices';
import * as Yup from 'yup';

const staffSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên nhân viên không được để trống')
    .max(255, 'Tên nhân viên không được vượt quá 255 ký tự'),
  email: Yup.string()
    .email('Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(255, 'Email không được vượt quá 255 ký tự'),
  staffCode: Yup.string()
    .required('Mã nhân viên không được để trống')
    .max(18, 'Mã nhân viên không được vượt quá 18 ký tự')
    .min(4, 'Mã nhân viên phải có ít nhất 4 ký tự')
    .matches(/^[a-zA-Z0-9]*$/, 'Mã nhân viên không được chứa ký tự tiếng Việt hoặc ký tự đặc biệt'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  branchId: Yup.string().required('Chi nhánh là bắt buộc'),
  role: Yup.string().required('Vai trò là bắt buộc'),
});
const EditStaffPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.staffs.error);
  const status = useSelector((state) => state.staffs.statusCreate);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      staffCode: '',
      password: '',
      branchId: '',
      role: 'staff',
    },
    validationSchema: staffSchema,
    onSubmit: (values) => {
      if (values.role === 'admin') {
        values.staffCode = `QL${values.staffCode.toLocaleUpperCase()}`;
      } else {
        values.staffCode = `NV${values.staffCode.toLocaleUpperCase()}`;
      }
      dispatch(createStaff(values));
    },
  });
  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Tạo nhân viên thành công');
      formik.resetForm();
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (status === 'failed') {
      handleToast('error', error?.message || 'Tạo nhân viên thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, dispatch]);
  return (
    <Container>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="flex-start" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate('/admin/settings/staffs')}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h6">Tạo nhân viên</Typography>
        </Stack>
        <Card
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 xs={12}>
                <Typography variant="h6">Thông tin nhân viên</Typography>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Tên nhân viên"
                  fullWidth
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Mã nhân viên"
                  fullWidth
                  name="staffCode"
                  value={formik.values.staffCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.staffCode && Boolean(formik.errors.staffCode)}
                  helperText={formik.touched.staffCode && formik.errors.staffCode}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Mật khẩu"
                  fullWidth
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Vai trò</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={formik.values.role}
                    label="Vai trò"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="staff">Nhân viên</MenuItem>
                    <MenuItem value="admin">Quản lý</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="branch-select-label">Chi nhánh</InputLabel>
                  <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    value={formik.values.branchId}
                    error={formik.touched.branchId && Boolean(formik.errors.branchId)}
                    name="branchId"
                    label="Chi nhánh"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="670a8c79f2f878ef31a0b506">Chi nhánh 1(Dữ liệu demo)</MenuItem>
                    <MenuItem value="670a8c79f2f878ef31a0b504">Chi nhánh 2(Dữ liệu demo)</MenuItem>
                  </Select>
                  <FormHelpTextError label={formik.touched.branchId && formik.errors.branchId} />
                </FormControl>
              </Grid2>
              <Grid2 xs={12}>
                <Button type="submit" variant="contained" color="inherit">
                  Tạo nhân viên
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Card>
      </Stack>
    </Container>
  );
};

export default EditStaffPage;
