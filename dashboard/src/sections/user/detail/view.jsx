import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Modal,
  Select,
  Button,
  MenuItem,
  TextField,
  Accordion,
  InputLabel,
  FormControl,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AddressService from 'src/redux/services/address.service';
import { handleToast } from 'src/hooks/toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  fetchAllUsers,
  fetchUserById,
  updateUserById,
} from 'src/redux/slices/userSlice';
import LoadingFull from 'src/components/loading/loading-full';
import { useParams } from 'react-router-dom';
import { isValidObjectId } from 'src/utils/check';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { cloneDeep } from 'lodash';
import { fetchAll } from 'src/redux/slices/warehouseSlices';
import { createStaff, setStatus as setStatusStaff } from 'src/redux/slices/staffSlices';
import CountrySelect from '../select-address';

// ----------------------------------------------------------------------
const userSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  name: Yup.string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  role: Yup.string().required('Vai trò là bắt buộc'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được quá 10 ký tự'),
});
const staffSchema = Yup.object().shape({
  staffCode: Yup.string()
    .required('Mã nhân viên không được để trống')
    .max(18, 'Mã nhân viên không được vượt quá 18 ký tự')
    .min(4, 'Mã nhân viên phải có ít nhất 4 ký tự')
    .matches(/^[a-zA-Z0-9]*$/, 'Mã nhân viên không được chứa ký tự tiếng Việt hoặc ký tự đặc biệt'),
  branchId: Yup.string().required('Chi nhánh là bắt buộc'),
  role: Yup.string().required('Vai trò là bắt buộc'),
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function DetailUserPage() {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const route = useRouter();
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(''); // Initialize with ''
  const [selectedDistrict, setSelectedDistrict] = useState(''); // Initialize with ''
  const [selectedWard, setSelectedWard] = useState(''); // Initialize with ''
  const [address, setAddress] = useState('Vui lòng chọn địa chỉ');
  const [isAddAddress, setIsAddAddress] = useState(false);

  const status = useSelector((state) => state.users.statusUpdate);
  const error = useSelector((state) => state.users.error);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  useEffect(() => {
    AddressService.getProvince().then((res) => {
      setProvince(res);
    });
  }, []);
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(fetchUserById(id));
        dispatch(fetchAll());
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/users');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const user = useSelector((state) => state.users.user);
  const statusGet = useSelector((state) => state.users.statusGet);
  const statusCreate = useSelector((state) => state.staffs.statusCreate);
  const errorStaff = useSelector((state) => state.staffs.error);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      role: user?.role || '',
    },
    enableReinitialize: true,
    validationSchema: userSchema,
    onSubmit: async (values) => {
      const data = {
        ...values,
      };
      if (values.password === '') {
        delete data.password;
      }
      delete data.email;
      data.addresses = addresses;
      dispatch(updateUserById({ id, data }));
    },
  });
  useEffect(() => {
    if (statusGet === 'successful') {
      setAddresses(user.addresses);
    }
    if (statusGet === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusGet, user, error]);

  const handleChangeProvince = (p) => {
    setWard([]);
    setDistrict([]);
    setSelectedDistrict(''); // Reset district
    setSelectedWard(''); // Reset ward
    setSelectedProvince(p);
    if (p) {
      AddressService.getDistrict(p.ProvinceID).then((res) => {
        setDistrict(res);
      });
    }
  };

  const handleChangeDistrict = (d) => {
    setWard([]);
    setSelectedWard('');
    setSelectedDistrict(d);
    if (d) {
      AddressService.getWard(d.DistrictID).then((res) => {
        setWard(res);
      });
    }
  };

  const handleChangeWard = (w) => {
    setSelectedWard(w);
  };
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleAddAddress = () => {
    setIsAddAddress(true);
    if (!selectedProvince || !selectedDistrict || !selectedWard || !address) {
      handleToast('error', 'Vui lòng chọn đầy đủ thông tin địa chỉ');
      return;
    }
    const d = cloneDeep(addresses);
    d.push({
      province_id: selectedProvince.ProvinceID,
      district_id: selectedDistrict.DistrictID,
      ward_id: selectedWard.WardCode,
      address,
      ward_name: selectedWard.WardName,
      district_name: selectedDistrict.DistrictName,
      province_name: selectedProvince.ProvinceName,
      phone: formik.values.phone,
      name: formik.values.name,
      fullAddress: `${address},${selectedWard.WardName}, ${selectedDistrict.DistrictName}, ${selectedProvince.ProvinceName}`,
      isDefault: false,
    });
    setAddresses([...d]);
  };
  useEffect(() => {
    if (statusCreate === 'successful') {
      handleToast('success', 'Tạo nhân viên thành công');
      dispatch(
        setStatusStaff({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      handleToast('error', errorStaff?.message || 'Tạo nhân viên thất bại');
      dispatch(
        setStatusStaff({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusCreate, errorStaff]);
  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Cập nhật người dùng thành công');
      dispatch(setStatus({ key: 'statusUpdate', value: '' }));
      dispatch(
        fetchAllUsers({
          page: 1,
          limit: 5,
        })
      );
      dispatch(setStatus({ key: 'error', value: 'idle' }));
    }
    if (status === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
      dispatch(setStatus({ key: 'statusUpdate', value: '' }));
      dispatch(setStatus({ key: 'error', value: 'idle' }));
    }
  }, [status, error, dispatch]);
  const formikStaff = useFormik({
    initialValues: {
      name: '',
      email: '',
      staffCode: '',
      password: '',
      branchId: '',
      role: '',
    },
    validationSchema: staffSchema,
    onSubmit: (values) => {
      values.name = formik.values.name;
      values.email = formik.values.email;
      values.password = values.staffCode;
      dispatch(createStaff(values));
    },
  });
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin người dùng</Typography>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formikStaff.handleSubmit}>
            <Stack gap={2}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Nâng cấp nhân viên
              </Typography>
              <TextField
                fullWidth
                label="Mã nhân viên"
                name="staffCode"
                value={formikStaff.values.staffCode}
                onChange={formikStaff.handleChange}
                error={formikStaff.touched.staffCode && Boolean(formikStaff.errors.staffCode)}
                helperText={formikStaff.touched.staffCode && formikStaff.errors.staffCode}
                onBlur={formikStaff.handleBlur}
              />
              <FormControl fullWidth>
                <InputLabel id="roleStaff-select-label">Vai trò</InputLabel>
                <Select
                  labelId="roleStaff-select-label"
                  id="roleStaff-select"
                  value={formikStaff.values.role}
                  name="role"
                  label="Vai trò"
                  onChange={formikStaff.handleChange}
                >
                  <MenuItem value="admin">Quản lý</MenuItem>
                  <MenuItem value="staff">Nhân viên</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="warehouse-select-label">Chi nhánh</InputLabel>
                <Select
                  labelId="warehouse-select-label"
                  id="warehouse-select"
                  value={formikStaff.values.branchId}
                  name="branchId"
                  label="Chi nhánh"
                  onChange={formikStaff.handleChange}
                >
                  {warehouses?.map((warehouse) => (
                    <MenuItem key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="inherit">
                Nâng cấp
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" typography="p" mb={3}>
          Thông tin người dùng
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={3}>
            <Grid2 xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                onBlur={formik.handleBlur}
              />
            </Grid2>

            <Grid2 xs={12} md={6}>
              <TextField
                type="password"
                fullWidth
                label="Mật khẩu"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                onBlur={formik.handleBlur}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="Điện thoại"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                onBlur={formik.handleBlur}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                disabled
                value={formik.values.email}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Trạng thái</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={formik.values.role}
                  name="role"
                  label="Trạng thái"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="user">Hoạt động</MenuItem>
                  <MenuItem value="ban">Khóa tài khoản</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} md={12}>
              {addresses?.length > 0 &&
                addresses.map((item, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<Iconify icon="eva:arrow-ios-downward-outline" />}
                      aria-controls="panel1-content"
                      id={`panel1a-header-${index}`}
                    >
                      Địa chỉ {index + 1} {item.isDefault && ' - Mặc định'}
                    </AccordionSummary>
                    <AccordionDetails>{item.fullAddress}</AccordionDetails>
                  </Accordion>
                ))}
            </Grid2>
            {isAddAddress && (
              <>
                <Grid2 xs={12} md={4}>
                  <CountrySelect
                    data={province}
                    query="ProvinceName"
                    label="Tỉnh"
                    onSelect={handleChangeProvince}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <CountrySelect
                    data={district}
                    query="DistrictName"
                    label="Huyện"
                    onSelect={handleChangeDistrict}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <CountrySelect
                    data={ward}
                    query="WardName"
                    label="Xã"
                    onSelect={handleChangeWard}
                  />
                </Grid2>
                <Grid2 xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ chi tiết"
                    value={address}
                    onChange={handleChangeAddress}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <LoadingButton
                    variant="contained"
                    color="inherit"
                    onClick={() => handleAddAddress()}
                  >
                    Lưu địa chỉ
                  </LoadingButton>
                  <LoadingButton
                    sx={{ ml: 2 }}
                    color="error"
                    onClick={() => setIsAddAddress(false)}
                  >
                    Hủy
                  </LoadingButton>
                </Grid2>
              </>
            )}
            <Grid2 xs={12} md={12}>
              <Stack direction="row" gap={2} alignItems="center" justifyContent="flex-end">
                <LoadingButton
                  variant="contained"
                  color="inherit"
                  type="button"
                  onClick={() => setIsAddAddress(true)}
                >
                  Thêm địa chỉ
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  color="inherit"
                  onClick={handleOpen}
                  loading={status === 'loading'}
                >
                  Nâng cấp lên nhân viên
                </LoadingButton>
                <LoadingButton color="inherit" onClick={() => route.push('/users')}>
                  Quay lại
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="inherit"
                  loading={status === 'loading'}
                >
                  Lưu
                </LoadingButton>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>
    </Container>
  );
}
