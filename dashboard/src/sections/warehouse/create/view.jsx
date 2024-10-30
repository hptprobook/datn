/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import AddressService from 'src/redux/services/address.service';
import { Button, Select, MenuItem, FormGroup, TextField, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import { setStatus } from 'src/redux/slices/brandSlices';
import LoadingFull from 'src/components/loading/loading-full';
import { createWarehouse } from 'src/redux/slices/warehouseSlices';
import CountrySelect from 'src/sections/timetables/select-address';
import { schema } from '../utils';

export default function WarehouseCreatePage() {
  const status = useSelector((state) => state.warehouses.statusCreate);
  const err = useSelector((state) => state.warehouses.error);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      capacity: 0,
      currentQuantity: 0,
      status: 'active',
      province_id: '',
      district_id: '',
      ward_id: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!values.status){
        handleToast('error', 'Vui lòng chọn trạng thái');
      }
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        handleToast('error', 'Vui lòng chọn địa chỉ');
        return;
      }

      values.province_id = selectedProvince.ProvinceID;
      values.district_id = selectedDistrict.DistrictID;
      values.ward_id = selectedWard.WardCode;
      dispatch(createWarehouse(values));
    },
  });
  
  useEffect(() => {
    if (status === 'successful') {
      
      handleToast('success', 'Tạo kho thành công!');
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));

    }
    if (status === 'failed') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      handleToast('error', err.messages ? err.messages : 'Có lỗi xảy ra');
    }
  }, [status, err, dispatch]);


  useEffect(() => {
    AddressService.getProvince().then((res) => {
      setProvince(res);
    });
  }, []);
  const handleChangeProvince = (provincecheck) => {
    setWard([]);
    setDistrict([]);
    setSelectedDistrict(''); // Reset district
    setSelectedWard(''); // Reset ward
    setSelectedProvince(provincecheck);
    if (provincecheck) {
      AddressService.getDistrict(provincecheck.ProvinceID).then((res) => {
        setDistrict(res);
      });
    }
  };

  const handleChangeDistrict = (districtCheck) => {
    setWard([]);
    setSelectedWard('');
    setSelectedDistrict(districtCheck);
    if (districtCheck) {
      AddressService.getWard(districtCheck.DistrictID).then((res) => {
        setWard(res);
      });
    }
  };

  const handleChangeWard = (wardCheck) => {
    setSelectedWard(wardCheck);
  };



  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Kho mới</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Grid2 container spacing={2}>
            <Grid2 xs={12}>
              <Typography variant="h5">Thông tin kho</Typography>
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Tên kho"
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Vị trí"
                name="location"
                value={formik.values.location}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid2>
            <Grid2 xs={4}>
              <TextField
                fullWidth
                label="Sức chứa"
                name="capacity"
                value={formik.values.capacity}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid2>
            <Grid2 xs={4}>
              <TextField
                fullWidth
                label="Hàng hiện tại"
                name="currentQuantity"
                value={formik.values.currentQuantity}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.currentQuantity && Boolean(formik.errors.currentQuantity)}
                helperText={formik.touched.currentQuantity && formik.errors.currentQuantity}
              />
            </Grid2>
            <Grid2 xs={4}>
              <FormGroup>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="active">Hoạt động</MenuItem>
                      <MenuItem value="close">Đóng cửa</MenuItem>
                    </Select>
                  }
                />
              </FormGroup>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <CountrySelect label='Tỉnh' data={province} query="ProvinceName" onSelect={handleChangeProvince} />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <CountrySelect label='Huyện' data={district} query="DistrictName" onSelect={handleChangeDistrict} />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <CountrySelect label='Xã' data={ward} query="WardName" onSelect={handleChangeWard} />
            </Grid2>
            <Grid2 xs={12}>
              <Button type="submit" variant="contained">
                Lưu
              </Button>
            </Grid2>
          </Grid2>
        </Card>
      </form>
    </Container>
  );
}