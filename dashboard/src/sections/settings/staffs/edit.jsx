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
  IconButton,
  FormControl,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import FormHelpTextError from 'src/components/errors/form-error';
import Iconify from 'src/components/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, getStaffBy, updateStaffById } from 'src/redux/slices/staffSlices';
import { isValidObjectId } from 'src/utils/check';
import * as Yup from 'yup';
import LoadingFull from 'src/components/loading/loading-full';
import { salaryType, renderSalaryType } from '../util';

const staffSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Tên phải có ít nhất 1 ký tự')
    .max(30, 'Tên không được vượt quá 30 ký tự')
    .required('Tên không được để trống'),
  // Allow null or undefined

  staffCode: Yup.string()
    .trim()
    .min(4, 'Mã nhân viên phải có ít nhất 4 ký tự')
    .max(20, 'Mã nhân viên không được vượt quá 20 ký tự')
    .required('Mã nhân viên không được để trống'),

  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),

  // branchId: Yup.string()
  //   .matches(/^[0-9a-fA-F]{24}$/, 'ID chi nhánh không hợp lệ')
  //   .required('ID chi nhánh là bắt buộc'),

  cccd: Yup.string()
    .matches(/^[0-9]+$/, 'CCCD chỉ được chứa số')
    .min(9, 'CCCD phải có ít nhất 9 ký tự')
    .max(12, 'CCCD không được vượt quá 12 ký tự'),

  bankAccount: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .matches(/^[0-9]+$/, 'Số tài khoản ngân hàng chỉ được chứa số')
    .min(10, 'Số tài khoản ngân hàng phải có ít nhất 10 ký tự')
    .max(20, 'Số tài khoản ngân hàng không được vượt quá 20 ký tự'),

  bankName: Yup.string()
    .nullable()
    .max(50, 'Tên ngân hàng không được vượt quá 50 ký tự')
    .transform((value) => (value === '' ? null : value)),
  bankHolder: Yup.string()
    .nullable()
    .max(50, 'Chủ tài khoản không được vượt quá 50 ký tự')
    .transform((value) => (value === '' ? null : value)),

  salaryType: Yup.string().oneOf(
    ['hourly', 'monthly', 'product', 'daily', 'customer', 'contract'],
    'Loại lương không hợp lệ'
  ),

  salary: Yup.number().typeError('Lương phải là số'),

  address: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

  phone: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(15, 'Số điện thoại không được vượt quá 15 ký tự')
    .nullable(), // Allow null or undefined

  role: Yup.string().oneOf(['root', 'admin', 'staff', 'ban'], 'Vai trò không hợp lệ'),
});
const EditStaffPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.staffs.error);
  const statusGet = useSelector((state) => state.staffs.statusGet);
  const status = useSelector((state) => state.staffs.statusUpdate);
  const navigate = useNavigate();
  const { id } = useParams();
  const data = useSelector((state) => state.staffs.staff);
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(
          getStaffBy({
            type: '_id',
            value: id,
          })
        );
      } else {
        handleToast('error', 'Id không hợp lệ');
        navigate('/admin/settings/staffs');
      }
    }
  }, [id, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      email: data?.email || '',
      staffCode: data?.staffCode || '',
      branchId: data?.branchId || '',
      role: data?.role || 'staff',
      address: data?.address || null,
      salary: data?.salary || '',
      salaryType: data?.salaryType || 'hourly',
      bankHolder: data?.bankHolder || null,
      bankName: data?.bankName || null,
      bankAccount: data?.bankAccount || null,
      phone: data?.phone || null,
    },
    enableReinitialize: true,
    validationSchema: staffSchema,
    onSubmit: (values) => {
      values.salary = Number(values.salary);
      delete values._id;
      Object.keys(values).forEach((key) => {
        if (values[key] === null) {
          delete values[key];
        }
      });
      dispatch(
        updateStaffById({
          id,
          data: values,
        })
      );
    },
  });
  useEffect(() => {
    if (status === 'successful') {
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
      handleToast('success', 'Cập nhật nhân viên thành công');
    }
    if (status === 'failed') {
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
      handleToast('error', error?.message || 'Cập nhật nhân viên thất bại');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, dispatch]);
  return (
    <Container>
      {statusGet === 'loading' && <LoadingFull />}
      {status === 'loading' && <LoadingFull />}

      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="flex-start" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate('/admin/settings/staffs')}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h6">Tạo nhân viên</Typography>
          <IconButton
            onClick={() =>
              dispatch(
                getStaffBy({
                  type: '_id',
                  value: id,
                })
              )
            }
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
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
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="CCCD/CMND"
                  fullWidth
                  name="cccd"
                  value={formik.values.cccd}
                  onChange={formik.handleChange}
                  error={formik.touched.cccd && Boolean(formik.errors.cccd)}
                  helperText={formik.touched.cccd && formik.errors.cccd}
                />
              </Grid2>
              <Grid2 xs={12} md={4}>
                <TextField
                  label="Mã nhân viên"
                  fullWidth
                  name="staffCode"
                  value={formik.values.staffCode}
                  onChange={formik.handleChange}
                  error={formik.touched.staffCode && Boolean(formik.errors.staffCode)}
                  helperText={formik.touched.staffCode && formik.errors.staffCode}
                />
              </Grid2>
              <Grid2 xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Vai trò</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={formik.values.role}
                    label="Vai trò"
                    name="role"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="staff">Nhân viên</MenuItem>
                    <MenuItem value="admin">Quản lý</MenuItem>
                    <MenuItem value="ban">Cấm</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 xs={12} md={4}>
                Chi nhánh đang phát triển
                {/* <FormControl fullWidth>
                  <InputLabel id="branch-select-label">Chi nhánh</InputLabel>
                  <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    value={formik.values.branchId}
                    error={formik.touched.branchId && Boolean(formik.errors.branchId)}
                    name="branchId"
                    label="Chi nhánh"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="670a8c79f2f878ef31a0b506">Chi nhánh 1(Dữ liệu demo)</MenuItem>
                    <MenuItem value="670a8c79f2f878ef31a0b504">Chi nhánh 2(Dữ liệu demo)</MenuItem>
                  </Select>
                  <FormHelpTextError label={formik.touched.branchId && formik.errors.branchId} />
                </FormControl> */}
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid2>
              <Grid2 xs={12}>
                <Typography variant="h6">Thông tin lương</Typography>
              </Grid2>

              <Grid2 xs={12} md={6}>
                <TextField
                  label="Lương"
                  fullWidth
                  name="salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="salaryType-select-label">Kiểu lương</InputLabel>
                  <Select
                    labelId="salaryType-select-label"
                    id="salaryType-select"
                    value={formik.values.salaryType}
                    error={formik.touched.salaryType && Boolean(formik.errors.salaryType)}
                    name="salaryType"
                    label="Kiểu lương"
                    onChange={formik.handleChange}
                  >
                    {salaryType.map((item) => (
                      <MenuItem key={item} value={item}>
                        {renderSalaryType(item)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelpTextError
                    label={formik.touched.salaryType && formik.errors.salaryType}
                  />
                </FormControl>
              </Grid2>
              <Grid2 xs={12} md={4}>
                <TextField
                  label="Tên tài khoản ngân hàng"
                  fullWidth
                  name="bankHolder"
                  value={formik.values.bankHolder}
                  onChange={formik.handleChange}
                  error={formik.touched.bankHolder && Boolean(formik.errors.bankHolder)}
                  helperText={formik.touched.bankHolder && formik.errors.bankHolder}
                />
              </Grid2>
              <Grid2 xs={12} md={4}>
                <TextField
                  label="Tên ngân hàng"
                  fullWidth
                  name="bankName"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                  helperText={formik.touched.bankName && formik.errors.bankName}
                />
              </Grid2>
              <Grid2 xs={12} md={4}>
                <TextField
                  label="Số tài khoản ngân hàng"
                  fullWidth
                  name="bankAccount"
                  value={formik.values.bankAccount}
                  onChange={formik.handleChange}
                  error={formik.touched.bankAccount && Boolean(formik.errors.bankAccount)}
                  helperText={formik.touched.bankAccount && formik.errors.bankAccount}
                />
              </Grid2>
              <Grid2 xs={12}>
                <Button type="submit" variant="contained" color="inherit">
                  Lưu
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
