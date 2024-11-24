/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { update, getDetail, setStatus } from 'src/redux/slices/supplierSlices';
import { useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { isValidObjectId } from 'src/utils/check';
import { ProductSupplierSelect } from '../product-select';

// ----------------------------------------------------------------------
export default function SupplierDetailPage() {
  const { id } = useParams();
  const statusGet = useSelector((state) => state.suppliers.statusGet);
  const statusUpdate = useSelector((state) => state.suppliers.statusUpdate);
  const data = useSelector((state) => state.suppliers.supplier);
  const err = useSelector((state) => state.suppliers.error);
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    rating: 0,
    registrationNumber: '',
    website: '',
    notes: '',
    productsSupplied: [],
  });
  const dispatch = useDispatch();
  const route = useRouter();
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(getDetail(id));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/suppliers');
      }
    }
  }, [id]);

  useEffect(() => {
    if (statusGet === 'successful') {
      setInitialValues({
        companyName: data.companyName,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        rating: data.rating,
        registrationNumber: data.registrationNumber,
        website: data.website,
        notes: data.notes,
        productsSupplied: data.productsSupplied || [],
      });
    }
    if (statusGet === 'failed') {
      console.log(err);
      handleToast('error', err.message);
      dispatch(setStatus({ key: 'statusGet', value: 'idle' }));
      dispatch(setStatus({ key: 'error', value: null }));
      route.push('/suppliers');
    }
  }, [statusGet, err, dispatch]);
  useEffect(() => {
    if (statusUpdate === 'successful') {
      handleToast('success', 'Cập nhật thành công');
      dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
    }
    if (statusUpdate === 'failed') {
      handleToast('error', err.message);
      dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
      dispatch(setStatus({ key: 'error', value: null }));
    }
  }, [statusUpdate, err, dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      const t = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === '' ? null : value])
      );
      dispatch(update({ id, data: t }));
    },
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nhà cung cấp: {formik.values.fullName}</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Grid2 container spacing={2}>
            <Grid2 xs={12}>
              <Typography variant="h5">Thông tin nhà cung cấp</Typography>
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Tên công ty"
                name="companyName"
                value={formik.values.companyName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formik.values.address}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Đánh giá"
                name="rating"
                value={formik.values.rating}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.rating && Boolean(formik.errors.rating)}
                helperText={formik.touched.rating && formik.errors.rating}
              />
            </Grid2>

            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Mã số thuế"
                name="registrationNumber"
                value={formik.values.registrationNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)
                }
                helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                onBlur={formik.handleBlur}
                value={formik.values.website}
                onChange={formik.handleChange}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
              />
            </Grid2>
            <Grid2 xs={12}>
              <ProductSupplierSelect
                value={formik.values.productsSupplied}
                setValue={(value) => formik.setFieldValue('productsSupplied', value)}
              />
            </Grid2>
            <Grid2 xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Ghi chú"
                name="notes"
                onBlur={formik.handleBlur}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid2>
            <Grid2 xs={12}>
              <Button type="submit" variant="contained" color="inherit">
                Lưu
              </Button>
            </Grid2>
          </Grid2>
        </Card>
      </form>
    </Container>
  );
}
