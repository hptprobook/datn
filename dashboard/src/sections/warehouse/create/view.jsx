/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Button, Switch, FormGroup, TextField, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import { setStatus } from 'src/redux/slices/brandSlices';
import LoadingFull from 'src/components/loading/loading-full';
import { fetchAll, createWarehouse } from 'src/redux/slices/warehouseSlices';
import { schema } from '../utils';
// ----------------------------------------------------------------------
export default function WarehouseCreatePage() {
  const status = useSelector((state) => state.warehouses.statusCreate);
  const err = useSelector((state) => state.warehouses.error);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === 'successful') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      dispatch(fetchAll());
      formik.resetForm();
      handleToast('success', 'Tạo kho thành công!');
    }
    if (status === 'failed') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      handleToast('error', err.messages ? err.messages : 'Có lỗi xảy ra');
    }
  }, [status, err, dispatch]);
  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      capacity: 0,
      currentInventory: 0,
      status: true,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      dispatch(createWarehouse(values));
    },
  });

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
                name="currentInventory"
                value={formik.values.currentInventory}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.currentInventory && Boolean(formik.errors.currentInventory)}
                helperText={formik.touched.currentInventory && formik.errors.currentInventory}
              />
            </Grid2>
            <Grid2 xs={4}>
              <FormGroup>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Switch
                      name="status"
                      checked={formik.values.status}
                      onChange={formik.handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Trạng thái"
                />
              </FormGroup>
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
