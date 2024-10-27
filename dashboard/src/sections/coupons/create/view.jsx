/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  Button,
  Select,
  Switch,
  MenuItem,
  FormGroup,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { create, setStatus } from 'src/redux/slices/couponSlice';
import { useMemo, useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import { createCode, couponSchema } from '../utils';
import ProductAcceptSelect from '../product-select';
// ----------------------------------------------------------------------
const now = dayjs();
export default function CreateCouponPage() {
  const [error, setError] = useState(null);
  const [errorEnd, setErrorEnd] = useState(null);

  const status = useSelector((state) => state.coupons.statusCreate);
  const err = useSelector((state) => state.coupons.error);

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'minDate': {
        return 'Ngày nhập phải lớn hơn ngày hiện tại';
      }

      case 'invalidDate': {
        return 'Bạn phải nhập 1 ngày hợp lệ';
      }

      default: {
        return '';
      }
    }
  }, [error]);
  const errorMessageEnd = useMemo(() => {
    switch (errorEnd) {
      case 'minDate': {
        return 'Ngày nhập phải lớn hơn ngày băt đầu';
      }

      case 'invalidDate': {
        return 'Bạn phải nhập 1 ngày hợp lệ';
      }

      default: {
        return '';
      }
    }
  }, [errorEnd]);
  const dispatch = useDispatch();
  const products_applied = useSelector((state) => state.products.products);

  useEffect(() => {
    if (status === 'successful') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      handleToast('success', 'Tạo mã giảm giá thành công!');
    }
    if (status === 'failed') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      handleToast('error', err.messages);
    }
  }, [status, err, dispatch]);
  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      type: 'percent',
      applicableProducts: [],
      minPurchasePrice: '',
      maxPurchasePrice: '',
      discountValue: '',
      description: '',
      usageLimit: '',
      discountPercent: '',
      status: 'active',
      dateStart: dayjs(),
      dateEnd: dayjs(),
      limitOnUser: false,
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      const data = { ...values };
      data.minPurchasePrice = Number(values.minPurchasePrice);
      data.maxPurchasePrice = Number(values.maxPurchasePrice);
      if (data.maxPurchasePrice === 0) {
        delete data.maxPurchasePrice;
      }
      data.discountValue = Number(values.discountValue);
      data.discountPercent = Number(values.discountPercent);

      if (data.discountValue === 0 && (data.type === 'price' || data.type === 'shipping')) {
        formik.setFieldError('discountValue', 'Giá trị khuyến mãi là bắt buộc.');
        return;
      }
      if (data.discountPercent === 0 && data.type === 'percent') {
        formik.setFieldError('discountPercent', 'Phần trăm khuyến mãi là bắt buộc.');
        return;
      }
      data.usageLimit = Number(values.usageLimit);
      data.dateStart = dayjs(values.dateStart).valueOf();
      data.dateEnd = dayjs(values.dateEnd).valueOf();
      dispatch(create(data));
    },
  });
  useEffect(() => {
    const name = formik.values.name?.trim();
    if (name) {
      const code = createCode(name);
      formik.setFieldValue('code', code);
    }
  }, [formik.values.name]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo mã giảm giá</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 xs={8}>
            <Card sx={{ p: 3, width: '100%' }}>
              <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                  <Typography variant="h5">Thông tin cơ bản</Typography>
                </Grid2>
                <Grid2 xs={12}>
                  <TextField
                    fullWidth
                    label="Tên khuyến mãi"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid2>
                <Grid2 xs={5}>
                  <FormGroup>
                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Switch
                          name="limitOnUser"
                          checked={formik.values.limitOnUser}
                          onChange={formik.handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label="Giới hạn mỗi người dùng"
                    />
                  </FormGroup>
                </Grid2>
                <Grid2 xs={7}>
                  <TextField
                    fullWidth
                    label="Code"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.code && Boolean(formik.errors.code)}
                    helperText={formik.touched.code && formik.errors.code}
                  />
                </Grid2>

                <Grid2 xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label">Loại</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      value={formik.values.type}
                      name="type"
                      label="Loại"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="percent">Phần trăm</MenuItem>
                      <MenuItem value="price">Giá tiền</MenuItem>
                      <MenuItem value="shipping">Phí ship</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
                <Grid2 xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-select-label">Trạng thái</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      name="status"
                      value={formik.values.status}
                      label="Trạng thái"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="active">Kích hoạt</MenuItem>
                      <MenuItem value="inactive">Chưa kích hoạt</MenuItem>
                      <MenuItem value="expired">Hết hạn</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 xs={4}>
                  <TextField
                    fullWidth
                    label="Giới hạn sử dụng"
                    name="usageLimit"
                    value={formik.values.usageLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.usageLimit && Boolean(formik.errors.usageLimit)}
                    helperText={formik.touched.usageLimit && formik.errors.usageLimit}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <TextField
                    fullWidth
                    label="Giá trị khuyến mãi"
                    name="discountValue"
                    disabled={formik.values.type === 'percent'}
                    value={formik.values.discountValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
                    helperText={formik.touched.discountValue && formik.errors.discountValue}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <TextField
                    fullWidth
                    label="Giá trị phần trăm"
                    name="discountPercent"
                    disabled={formik.values.type === 'price' || formik.values.type === 'shipping'}
                    value={formik.values.discountPercent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
                    helperText={formik.touched.discountPercent && formik.errors.discountPercent}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <TextField
                    fullWidth
                    label="Giá trị mua tối thiểu"
                    name="minPurchasePrice"
                    value={formik.values.minPurchasePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.minPurchasePrice && Boolean(formik.errors.minPurchasePrice)
                    }
                    helperText={formik.touched.minPurchasePrice && formik.errors.minPurchasePrice}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <TextField
                    fullWidth
                    label="Giá trị mua tối đa"
                    name="maxPurchasePrice"
                    value={formik.values.maxPurchasePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.maxPurchasePrice && Boolean(formik.errors.maxPurchasePrice)
                    }
                    helperText={formik.touched.maxPurchasePrice && formik.errors.maxPurchasePrice}
                  />
                </Grid2>
                <Grid2 xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid2>
                <Grid2 xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="Ngày bắt đầu"
                        value={formik.values.dateStart}
                        onError={(newError) => setError(newError)}
                        slotProps={{
                          textField: {
                            helperText: errorMessage,
                          },
                        }}
                        minDate={now}
                        onChange={(date) => formik.setFieldValue('dateStart', date)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid2>
                <Grid2 xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="Ngày hết hạn"
                        value={formik.values.dateEnd}
                        onError={(newError) => setErrorEnd(newError)}
                        slotProps={{
                          textField: {
                            helperText: errorMessageEnd,
                          },
                        }}
                        minDate={formik.values.dateStart}
                        onChange={(date) => formik.setFieldValue('dateEnd', date)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  {}
                </Grid2>
              </Grid2>
              <Stack direction="row" justifyContent="flex-end" mt={3}>
                <Button type="submit" color="inherit" variant="contained">
                  Tạo
                </Button>
              </Stack>
            </Card>
          </Grid2>

          <Grid2 xs={4}>
            <Card sx={{ p: 3, width: '100%' }}>
              <Grid2 xs={12}>
                <Typography variant="h5">Sản phẩm áp dụng</Typography>
              </Grid2>
              <Grid2 xs={12}>
              <ProductAcceptSelect
            value={formik.values.applicableProducts.map((_id) => products_applied.find((product) => product._id === _id))}
            onChange={(event, newValue) => formik.setFieldValue('applicableProducts', newValue.map((product) => product._id))}
          />
              </Grid2>
            </Card>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
