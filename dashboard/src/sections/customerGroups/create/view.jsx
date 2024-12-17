/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Card,
  Radio,
  Button,
  Select,
  MenuItem,
  TextField,
  SpeedDial,
  FormLabel,
  RadioGroup,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, createCustomerGroup } from 'src/redux/slices/CustomerGroupSlice';
import LoadingFull from 'src/components/loading/loading-full';
// import { AutoSelect } from '../auto-select';
import { customerGroupSchema } from '../utils';

// ----------------------------------------------------------------------

export default function CreateCustomerGroupPage() {
  const dispatch = useDispatch();

  const status = useSelector((state) => state.customerGroups.statusCreate);
  const error = useSelector((state) => state.customerGroups.error);

  const [manual, setManual] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: '',
      note: '',
      manual: true,
      satisfy: 'all',
      ...(manual === false && {
        auto: [
          {
            field: '',
            query: '',
            status: '',
          },
        ],
      }),
      listCustomer: [],
    },
    validationSchema: customerGroupSchema,
    onSubmit: (values) => {
      if (values.manual === false) {
        if (!values.auto || values.auto.length === 0) {
          handleToast('error', 'Vui lòng chọn ít nhất một điều kiện');
          return;
        }

        const auto = values.auto[0];
        if (!auto.field) {
          handleToast('error', 'Trường là bắt buộc');
          return;
        }
        if (!auto.query) {
          handleToast('error', 'Điều kiện là bắt buộc');
          return;
        }
        if (!auto.status) {
          handleToast('error', 'Giá trị là bắt buộc');
          return;
        }
      }

      if (values.manual) {
        delete values.auto;
      }
      console.log(values);
      dispatch(createCustomerGroup({ data: values }));
    },
  });

  useEffect(() => {
    if (status === 'failed') {
      console.log('error', error);
      handleToast('error', error.message);
    }
    if (status === 'successful') {
      handleToast('success', 'Tạo nhóm khách hàng thành công');
    }
    dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, dispatch]);
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <SpeedDial
        ariaLabel="Lưu Nhóm khách hàng"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo nhóm khách hàng mới</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 xs={8}>
            <Stack spacing={3}>
              <Card sx={{ padding: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Thông tin cơ bản
                </Typography>
                <Grid2 container spacing={3}>
                  <Grid2 xs={12}>
                    <TextField
                      fullWidth
                      label="Tên nhóm khách hàng"
                      variant="outlined"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      rows={2} // Adjust the number of rows as needed
                      multiline
                    />
                  </Grid2>
                </Grid2>
              </Card>
            </Stack>
          </Grid2>
          <Grid2 xs={4}>
            <Card sx={{ padding: 3 }}>
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Ghi chú
                </Typography>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  variant="outlined"
                  name="note"
                  placeholder="VD: Nhóm khách hàng mua hàng thường xuyên"
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.note && Boolean(formik.errors.note)}
                  helperText={formik.touched.note && formik.errors.note}
                  rows={2} // Adjust the number of rows as needed
                  multiline
                />
              </Stack>
            </Card>
          </Grid2>
          <Grid2 xs={12}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Phân loại
              </Typography>
              <FormControl component="fieldset">
                <FormLabel component="legend">Thủ công</FormLabel>
                <RadioGroup
                  aria-label="manual"
                  name="manual"
                  value={formik.values.manual.toString()} // Convert boolean to string
                  onChange={(event) => {
                    const isManual = event.target.value === 'true';
                    setManual(isManual);
                    formik.setFieldValue('manual', isManual); // Convert string back to boolean
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Thủ công" />
                  <FormControlLabel value="false" control={<Radio />} label="Tự động" />
                </RadioGroup>
              </FormControl>
              {!formik.values.manual && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Tự động
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Khách hàng phải thỏa mãn:</FormLabel>
                      <RadioGroup
                        row
                        aria-label="satisfy"
                        name="satisfy"
                        value={formik.values.satisfy}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel
                          value="all"
                          control={<Radio />}
                          label="Tất cả các điều kiện"
                        />
                        <FormControlLabel
                          value="once"
                          control={<Radio />}
                          label="Một trong các điều kiện"
                        />
                      </RadioGroup>
                      <FormHelperText>
                        {formik.touched.satisfy && formik.errors.satisfy
                          ? formik.errors.satisfy
                          : ''}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                      <Select
                        labelId="field-select-label"
                        id="field-select"
                        name="auto[0].field"
                        value={formik.values.auto?.[0]?.field || ''}
                        label="Field"
                        onChange={formik.handleChange}
                        error={
                          formik.touched.auto &&
                          formik.errors.auto &&
                          formik.errors.auto[0] &&
                          formik.errors.auto[0].field
                        }
                      >
                        <MenuItem value="">Vui lòng chọn</MenuItem>
                        <MenuItem value="Trạng thái">Trạng thái</MenuItem>
                      </Select>
                      <FormHelperText>
                        {formik.touched.auto &&
                        formik.errors.auto &&
                        formik.errors.auto[0] &&
                        formik.errors.auto[0].field
                          ? formik.errors.auto[0].field
                          : ''}
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        labelId="query-select-label"
                        id="query-select"
                        name="auto[0].query"
                        value={formik.values.auto?.[0]?.query || ''}
                        label="Query"
                        onChange={formik.handleChange}
                        error={
                          formik.touched.auto &&
                          formik.errors.auto &&
                          formik.errors.auto[0] &&
                          formik.errors.auto[0].query
                        }
                      >
                        <MenuItem value="">Vui lòng chọn</MenuItem>
                        <MenuItem value="Là">Là</MenuItem>
                      </Select>
                      <FormHelperText>
                        {formik.touched.auto &&
                        formik.errors.auto &&
                        formik.errors.auto[0] &&
                        formik.errors.auto[0].query
                          ? formik.errors.auto[0].query
                          : ''}
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        labelId="status-select-label"
                        id="status-select"
                        name="auto[0].status"
                        value={formik.values.auto?.[0]?.status || ''}
                        label="Status"
                        onChange={formik.handleChange}
                        error={
                          formik.touched.auto &&
                          formik.errors.auto &&
                          formik.errors.auto[0] &&
                          formik.errors.auto[0].status
                        }
                      >
                        <MenuItem value="">Vui lòng chọn</MenuItem>
                        <MenuItem value="Có tài khoản">Có tài khoản</MenuItem>
                        <MenuItem value="Chưa có tài khoản">Chưa có tài khoản</MenuItem>
                        <MenuItem value="Đã gửi lời mời đăng ký">Đã gửi lời mời đăng ký</MenuItem>
                      </Select>
                      <FormHelperText>
                        {formik.touched.auto &&
                        formik.errors.auto &&
                        formik.errors.auto[0] &&
                        formik.errors.auto[0].status
                          ? formik.errors.auto[0].status
                          : ''}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Box>
              )}
            </Card>
          </Grid2>
          <Grid2 xs={12}>
            <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
              <Button
                type="button"
                onClick={() => formik.handleSubmit()}
                variant="contained"
                color="inherit"
              >
                Tạo nhóm
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
