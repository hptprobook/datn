import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';
import { getDistrict, getProvince } from 'src/utils/requestGHN';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// ----------------------------------------------------------------------
const userSchema = Yup.object().shape({
  email: Yup.string().email('Email phải là một địa chỉ email hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  firstName: Yup.string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  lastName: Yup.string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được quá 50 ký tự'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được quá 10 ký tự'),
  noteAddress: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(255, 'Địa chỉ không được quá 255 ký tự'),
});
export default function CreateUserPage() {
  const [role, setRole] = useState('user');
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('Vui lòng chọn địa chỉ');

  useEffect(() => {
    getProvince('/province').then((res) => {
      setProvince(res.data);
    });
  }, []);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      noteAddress: '',
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleChangeProvince = (event) => {
    setWard([]);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistrict([]);
    setSelectedProvince(event.target.value);
    const selectedProvinceId = event.target.value;
    getDistrict('/district', {
      province_id: selectedProvinceId,
    }).then((res) => {
      setDistrict(res.data);
    });
  };

  const handleChangeDistrict = (event) => {
    setWard([]);
    setSelectedWard('');
    setSelectedDistrict(event.target.value);
    const selectedDistrictId = event.target.value;
    getDistrict('/ward?district_id', {
      district_id: selectedDistrictId,
    }).then((res) => {
      setWard(res.data);
    });
  };

  const handleChangeWard = (event) => {
    setSelectedWard(event.target.value);
    let addressStr = '';
    const selectedWardObj = ward.find((item) => item.WardCode === event.target.value);
    const selectedDistrictObj = district.find((item) => item.DistrictID === selectedDistrict);
    const selectedProvinceObj = province.find((item) => item.ProvinceID === selectedProvince);

    if (selectedWardObj && selectedDistrictObj && selectedProvinceObj) {
      addressStr = `${selectedWardObj.WardName}, ${selectedDistrictObj.DistrictName}, ${selectedProvinceObj.ProvinceName}`;
    }
    setAddress(addressStr);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thêm người dùng mới</Typography>
      </Stack>

      <Card
        sx={{
          p: 3,
        }}
      >
        <Typography variant="h6" typography="p">
          Thêm người dùng mới
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={3}>
            <Grid2 xs={12} md={8}>
              <TextField
                fullWidth
                label="Họ"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                onBlur={formik.handleBlur}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="Tên"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                onBlur={formik.handleBlur}
              />
            </Grid2>

            <Grid2 xs={12} md={8}>
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Vai trò</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Vai trò"
                  onChange={handleChange}
                >
                  <MenuItem value="user">Người dùng</MenuItem>
                  <MenuItem value="employee">Nhân viên</MenuItem>
                  <MenuItem value="root">Quảng lý</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="select-province">Tỉnh/Thành phố</InputLabel>
                <Select
                  labelId="select-province"
                  id="id-select-province"
                  value={selectedProvince}
                  label="Tỉnh/Thành phố"
                  onChange={handleChangeProvince}
                >
                  {province.map((item) => (
                    <MenuItem key={item.ProvinceID} value={item.ProvinceID}>
                      {item.ProvinceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="select-district">Huyện</InputLabel>
                <Select
                  labelId="select-district"
                  id="id-select-district"
                  value={selectedDistrict}
                  label="Huyện"
                  onChange={handleChangeDistrict}
                >
                  {district.map((item) => (
                    <MenuItem key={item.DistrictID} value={item.DistrictID}>
                      {item.DistrictName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="select-ward">Xã</InputLabel>
                <Select
                  labelId="select-ward"
                  id="id-select-ward"
                  value={selectedWard}
                  label="Xã"
                  onChange={handleChangeWard}
                >
                  {ward.map((item) => (
                    <MenuItem key={item.WardCode} value={item.WardCode}>
                      {item.WardName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Grid2 xs={12} md={6}>
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
            <Grid2 xs={12} md={6}>
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
