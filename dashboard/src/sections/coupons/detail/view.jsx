/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Tab,
  Tabs,
  Button,
  Select,
  Switch,
  MenuItem,
  FormGroup,
  TextField,
  SpeedDial,
  InputLabel,
  IconButton,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import Iconify from 'src/components/iconify/iconify';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { isValidObjectId } from 'src/utils/check';
import { useDispatch, useSelector } from 'react-redux';
import { update, fetchOne, setStatus, fetchHistory } from 'src/redux/slices/couponSlice';
import { useMemo, useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import PropTypes from 'prop-types';
import { ProductList } from 'src/sections/receiptsWarehouse/product-list';
import { getProductByArrayId } from 'src/redux/slices/posSlices';
import { couponSchema } from '../utils';

import HistoryUsedTable from '../history-table';
import ProductSelectedList from '../product-select-list';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      style={{ paddingTop: 16 }}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// ----------------------------------------------------------------------
export default function DetailCouponPage() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(0);
  const [errorDate, setErrorDate] = useState(null);
  const [errorEnd, setErrorEnd] = useState(null);

  const status = useSelector((state) => state.coupons.statusUpdate);
  const err = useSelector((state) => state.coupons.error);
  const coupon = useSelector((state) => state.coupons.coupon);
  const statusGetCoupon = useSelector((state) => state.coupons.status);

  const route = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(fetchOne(id));

        dispatch(fetchHistory(id));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/coupons');
      }
    }
  }, [id]);
  useEffect(() => {
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      console.log(coupon.applicableProducts);
      dispatch(
        getProductByArrayId({
          ids: coupon.applicableProducts,
        })
      ).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setProducts(res.payload);
        }
      });
    }
  }, [coupon]);

  const errorMessage = useMemo(() => {
    switch (errorDate) {
      case 'invalidDate': {
        return 'Bạn phải nhập 1 ngày hợp lệ';
      }

      default: {
        return '';
      }
    }
  }, [errorDate]);

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

  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Cập nhật mã giảm giá thành công');
      dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
    }
    if (status === 'failed') {
      handleToast('error', err?.message || 'Có lỗi xảy ra');
      dispatch(setStatus({ key: 'error', value: 'idle' }));
    }
  }, [status, err, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: coupon.name || '',
      code: coupon.code || '',
      type: coupon.type || 'percent',
      applicableProducts: coupon.applicableProducts || [],
      minPurchasePrice: coupon.minPurchasePrice || '',
      maxPurchasePrice: coupon.maxPurchasePrice || 0,
      discountValue: coupon.discountValue || 0,
      description: coupon.description || '',
      usageLimit: coupon.usageLimit || 0,
      discountPercent: coupon.discountPercent || 0,
      status: coupon.status || 'active',
      dateStart: coupon.dateStart ? dayjs(coupon.dateStart) : dayjs(), // Ensure dateStart is a dayjs object
      dateEnd: coupon.dateEnd ? dayjs(coupon.dateEnd) : dayjs(), // Ensure dateEnd is a dayjs object
      limitOnUser: coupon.limitOnUser || false,
    },
    enableReinitialize: true,
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
      data.applicableProducts = products.map((product) => product._id);
      dispatch(update({ id, data }));
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddProduct = (product) => {
    if (products.find((item) => item._id === product._id)) {
      return;
    }
    setProducts([...products, product]);
  };
  const handleDelete = (i) => {
    const newProducts = products.filter((product) => product._id !== i);
    setProducts(newProducts);
  };

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusGetCoupon === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Chỉnh sửa mã giảm giá</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchOne(id))}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Chi tiết" {...a11yProps(0)} />
            <Tab label="Lịch sử sử dụng" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
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
                        error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
                        helperText={formik.touched.discountValue && formik.errors.discountValue}
                      />
                    </Grid2>
                    <Grid2 xs={4}>
                      <TextField
                        fullWidth
                        label="Giá trị phần trăm"
                        name="discountPercent"
                        disabled={
                          formik.values.type === 'price' || formik.values.type === 'shipping'
                        }
                        value={formik.values.discountPercent}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.discountPercent && Boolean(formik.errors.discountPercent)
                        }
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
                        error={
                          formik.touched.minPurchasePrice && Boolean(formik.errors.minPurchasePrice)
                        }
                        helperText={
                          formik.touched.minPurchasePrice && formik.errors.minPurchasePrice
                        }
                      />
                    </Grid2>
                    <Grid2 xs={6}>
                      <TextField
                        fullWidth
                        label="Giá trị mua tối đa"
                        name="maxPurchasePrice"
                        value={formik.values.maxPurchasePrice}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.maxPurchasePrice && Boolean(formik.errors.maxPurchasePrice)
                        }
                        helperText={
                          formik.touched.maxPurchasePrice && formik.errors.maxPurchasePrice
                        }
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
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                      />
                    </Grid2>
                    <Grid2 xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Ngày bắt đầu"
                          value={dayjs(formik.values.dateStart)} // Ensure value is a dayjs object
                          onError={(newError) => setErrorDate(newError)}
                          slotProps={{
                            textField: {
                              helperText: errorMessage,
                            },
                          }}
                          onChange={(date) => formik.setFieldValue('dateStart', date)}
                        />
                      </LocalizationProvider>
                    </Grid2>
                    <Grid2 xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Ngày hết hạn"
                          value={formik.values.dateEnd} // Ensure value is a dayjs object
                          onError={(newError) => setErrorEnd(newError)}
                          slotProps={{
                            textField: {
                              helperText: errorMessageEnd,
                            },
                          }}
                          minDate={formik.values.dateStart} // Ensure minDate is a dayjs object
                          onChange={(date) => formik.setFieldValue('dateEnd', date)}
                        />
                      </LocalizationProvider>
                      {}
                    </Grid2>
                  </Grid2>
                  <Stack direction="row" justifyContent="flex-end" mt={3}>
                    <Button
                      onClick={() => formik.handleSubmit()}
                      type="button"
                      color="inherit"
                      variant="contained"
                    >
                      Lưu
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
                    <ProductList onAddProduct={handleAddProduct} />
                    <ProductSelectedList products={products} onDelete={handleDelete} />
                  </Grid2>
                </Card>
              </Grid2>
            </Grid2>
          </form>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <HistoryUsedTable />
        </CustomTabPanel>
      </Box>
      <SpeedDial
        ariaLabel="Lưu mã giảm giá"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
    </Container>
  );
}
