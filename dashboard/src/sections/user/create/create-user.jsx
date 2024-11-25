/* eslint-disable no-shadow */
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AddressService from 'src/redux/services/address.service';
import { handleToast } from 'src/hooks/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, createUser } from 'src/redux/slices/userSlice';
import LoadingFull from 'src/components/loading/loading-full';
import CountrySelect from '../select-address';

// ----------------------------------------------------------------------
const userSchema = Yup.object().shape({
  email: Yup.string().email('Email phải là một địa chỉ email hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  name: Yup.string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được quá 10 ký tự'),
  noteAddress: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(4, 'Địa chỉ phải có ít nhất 4 ký tự')
    .max(255, 'Địa chỉ không được quá 255 ký tự'),
});

export default function CreateUserPage() {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const dispatch = useDispatch();
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(''); 
  const [selectedDistrict, setSelectedDistrict] = useState(''); 
  const [selectedWard, setSelectedWard] = useState(''); 
  const [address, setAddress] = useState('Vui lòng chọn địa chỉ');
  const status = useSelector((state) => state.users.statusCreate);
  const error = useSelector((state) => state.users.error);
  useEffect(() => {
    AddressService.getProvince().then((res) => {
      setProvince(res);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      phone: '',
      noteAddress: '',
      role: 'user',
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      if (selectedWard === '') {
        handleToast('error', 'Vui lòng chọn địa chỉ');
        return;
      }
      const dataAddress = {
        name: values.name,
        phone: values.phone,
        district_id: selectedDistrict.DistrictID,
        ward_id: selectedWard.WardID,
        address,
        province_id: selectedProvince.ProvinceID,
        isDefault: true,
        note: values.noteAddress,
      };
      const newData = {
        ...values,
        addresses: [dataAddress],
      };
      delete newData.noteAddress;
      dispatch(createUser(newData));
    },
  });

  const handleChangeProvince = (province) => {
    setWard([]);
    setDistrict([]);
    setSelectedDistrict(''); // Reset district
    setSelectedWard(''); // Reset ward
    setSelectedProvince(province);
    if (province) {
      AddressService.getDistrict(province.ProvinceID).then((res) => {
        setDistrict(res);
      });
    }
  };

  const handleChangeDistrict = (district) => {
    setWard([]);
    setSelectedWard('');
    setSelectedDistrict(district);
    if (district) {
      AddressService.getWard(district.DistrictID).then((res) => {
        setWard(res);
      });
    }
  };

  const handleChangeWard = (ward) => {
    setSelectedWard(ward);
    const addressStr = `${ward.WardName}, ${selectedDistrict.DistrictName}, ${selectedProvince.ProvinceName}`;
    setAddress(addressStr);
  };
  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Tạo người dùng thành công');
      dispatch(setStatus({ key: 'statusCreate', value: '' }));
      dispatch(setStatus({ key: 'error', value: 'idle' }));
    }
    if (status === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
      dispatch(setStatus({ key: 'statusCreate', value: '' }));
      dispatch(setStatus({ key: 'error', value: 'idle' }));
    }
  }, [status, error, dispatch]);

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thêm người dùng mới</Typography>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" typography="p">
          Thêm người dùng mới
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={3}>
            <Grid2 xs={12} md={4}>
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

            <Grid2 xs={12} md={4}>
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
            <Grid2 xs={12} md={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                onBlur={formik.handleBlur}
              />
            </Grid2>
            <Grid2 xs={12} md={3}>
              <CountrySelect data={province} query="ProvinceName" onSelect={handleChangeProvince} />
            </Grid2>
            <Grid2 xs={12} md={3}>
              <CountrySelect data={district} query="DistrictName" onSelect={handleChangeDistrict} />
            </Grid2>
            <Grid2 xs={12} md={3}>
              <CountrySelect data={ward} query="WardName" onSelect={handleChangeWard} />
            </Grid2>
            <Grid2 xs={12} md={6}>
              <TextField fullWidth label="Địa chỉ" disabled value={address} />
            </Grid2>
            <Grid2 xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ chi tiết"
                name="noteAddress"
                value={formik.values.noteAddress}
                onChange={formik.handleChange}
                error={formik.touched.noteAddress && Boolean(formik.errors.noteAddress)}
                helperText={formik.touched.noteAddress && formik.errors.noteAddress}
                onBlur={formik.handleBlur}
              />
            </Grid2>

            <Grid2 xs={12} md={3}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                // disabled={submit}
                variant="contained"
                color="inherit"
              >
                Tạo
              </LoadingButton>
            </Grid2>
          </Grid2>
        </form>
      </Card>
    </Container>
  );
}
