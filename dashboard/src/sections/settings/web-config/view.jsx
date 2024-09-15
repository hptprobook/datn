import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Tab, Tabs, Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, getConfigWebsite, updateConfigWebsite } from 'src/redux/slices/settingSlices';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import EditableField from '../edit-field';
// ----------------------------------------------------------------------
const configSchema = Yup.object().shape({
  nameCompany: Yup.string()
    .required('Tên không được để trống')
    .min(2, 'Tên quá ngắn')
    .max(60, 'Tên quá dài'),
  website: Yup.string()
    .required('Đường dẫn website không được để trống')
    .url('Đường dẫn website không hợp lệ')
    .max(255, 'Đường dẫn website quá dài'),
  address: Yup.string()
    .required('Địa chỉ không được để trống')
    .min(2, 'Địa chỉ quá ngắn')
    .max(255, 'Địa chỉ quá dài'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email không được để trống')
    .max(255, 'Email quá dài'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ'),
  hotline: Yup.string().matches(/^[0-9]+$/, 'Hotline không hợp lệ'),
  zalo: Yup.string().matches(/^[0-9]+$/, 'Zalo không hợp lệ'),
  nameBank: Yup.string().min(2, 'Tên ngân hàng quá ngắn').max(255, 'Tên ngân hàng quá dài'),

  numberBank: Yup.string().min(2, 'Số tài khoản quá ngắn').max(255, 'Số tài khoản quá dài'),
  nameholderBank: Yup.string()
    .min(2, 'Tên chủ tài khoản quá ngắn')
    .max(255, 'Tên chủ tài khoản quá dài'),
  logo: Yup.string().min(2, 'Logo quá ngắn').max(255, 'Logo quá dài'),
  FanpageFb: Yup.string().url('URL không hợp lệ'),
  ZaloWeb: Yup.string().url('URL không hợp lệ'),
  Instagram: Yup.string().url('URL không hợp lệ'),
  Youtube: Yup.string().url('URL không hợp lệ'),
  Tiktok: Yup.string().url('URL không hợp lệ'),
  LinkWebConnect: Yup.string().url('URL không hợp lệ'),
});
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && <Box sx={{ pl: 3, width: '100%' }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
export default function WebConfigPage() {
  const [value, setValue] = useState(0);
  const [config, setConfig] = useState({});
  const dispatch = useDispatch();

  const data = useSelector((state) => state.settings.web);
  const status = useSelector((state) => state.settings.statusWeb);
  const statusUpdate = useSelector((state) => state.settings.statusUpdateWeb);
  const error = useSelector((state) => state.settings.error);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nameCompany: config.nameCompany || '',
      website: config.website || '',
      address: config.address || '',
      email: config.email || '',
      phone: config.phone || '',
      hotline: config.hotline || '',
      zalo: config.zalo || '',
      nameBank: config.nameBank || '',
      numberBank: config.numberBank || '',
      nameholderBank: config.nameholderBank || '',
      logo: config.logo || '',
      FanpageFb: config.FanpageFb || '',
      ZaloWeb: config.ZaloWeb || '',
      Instagram: config.Instagram || '',
      Youtube: config.Youtube || '',
      Tiktok: config.Tiktok || '',
      LinkWebConnect: config.LinkWebConnect || '',
    },
    validationSchema: configSchema,
  });
  useEffect(() => {
    dispatch(getConfigWebsite());
  }, [dispatch]);
  const formikRef = useRef(formik);

  useEffect(() => {
    if (status === 'succeeded' && data) {
      setConfig(data);
      formikRef.current.setValues(data);
    }
  }, [status, data]);
  useEffect(() => {
    if (statusUpdate === 'succeeded' && data) {
      handleToast('success', 'Cập nhật thành công');
      setInputSelect('');
      dispatch(setStatus({ key: 'statusUpdateWeb', value: 'idle' }));
    }
    if (statusUpdate === 'failed') {
      handleToast('error', error);
    }
  }, [statusUpdate, data, error, dispatch]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmit = () => {
    if (formik.errors && Object.keys(formik.errors).length > 0) {
      Object.keys(formik.errors).forEach((key) => {
        handleToast('error', formik.errors[key]);
      });
      return;
    }
    const newValues = { ...formik.values }; // Create a shallow copy of formik.values
    delete newValues.logo; // Delete the 'logo' property
    delete newValues._id; // Delete the '_id' property
    dispatch(updateConfigWebsite({ values: newValues }));
  };
  const handleCancel = () => {
    formik.resetForm();
    setInputSelect('');
  };
  const handleUpdate = (name) => {
    console.log(formik.values[name]);
    if (formik.values[name] === config[name]) {
      handleCancel();
      return;
    }
    if (formik.errors[name]) {
      handleToast('error', formik.errors[name]);
      return;
    }
    const values = {
      [name]: formik.values[name],
    };
    dispatch(updateConfigWebsite({ values }));
  };

  const [inputSelect, setInputSelect] = useState('');
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin trang web</Typography>

        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
          Thêm người dùng
        </Button> */}
      </Stack>
      {status === 'succeeded' && formik.initialValues && (
        <form onSubmit={formik.handleSubmit}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Thông tin trang web"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Thông tin cơ bản" {...a11yProps(0)} />
                <Tab label="Thông tin thanh toán" {...a11yProps(1)} />
                <Tab label="Social" {...a11yProps(2)} />
              </Tabs>
              {/* Thông tin cơ bản */}
              <TabPanel value={value} index={0}>
                <Grid2 spacing={2} container>
                  <Grid2 container spacing={2} xs={8}>
                    <Grid2 xs={12}>
                      <EditableField
                        name="nameCompany"
                        label="Tên công ty"
                        value={formik.values.nameCompany}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nameCompany && Boolean(formik.errors.nameCompany)}
                        helperText={formik.touched.nameCompany && formik.errors.nameCompany}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={12}>
                      <EditableField
                        name="website"
                        label="Website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.website && Boolean(formik.errors.website)}
                        helperText={formik.touched.website && formik.errors.website}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={12}>
                      <EditableField
                        name="address"
                        label="Địa chỉ"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={12}>
                      <EditableField
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={12}>
                      <EditableField
                        name="phone"
                        label="Số điện thoại"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={12}>
                      <EditableField
                        name="hotline"
                        label="Hotline"
                        value={formik.values.hotline}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.hotline && Boolean(formik.errors.hotline)}
                        helperText={formik.touched.hotline && formik.errors.hotline}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>
              </TabPanel>
              {/* Thông tin thanh toán */}
              <TabPanel value={value} index={1}>
                <Grid2 container spacing={2}>
                  <Grid2 xs={12}>
                    <EditableField
                      name="nameBank"
                      label="Tên ngân hàng"
                      value={formik.values.nameBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.nameBank && Boolean(formik.errors.nameBank)}
                      helperText={formik.touched.nameBank && formik.errors.nameBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="numberBank"
                      label="Số tài khoản"
                      value={formik.values.numberBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.numberBank && Boolean(formik.errors.numberBank)}
                      helperText={formik.touched.numberBank && formik.errors.numberBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="nameholderBank"
                      label="Tên chủ tài khoản"
                      value={formik.values.nameholderBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.nameholderBank && Boolean(formik.errors.nameholderBank)}
                      helperText={formik.touched.nameholderBank && formik.errors.nameholderBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Grid2 container spacing={2}>
                  <Grid2 xs={12}>
                    <EditableField
                      name="FanpageFb"
                      label="Fanpage Facebook"
                      value={formik.values.FanpageFb}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.FanpageFb && Boolean(formik.errors.FanpageFb)}
                      helperText={formik.touched.FanpageFb && formik.errors.FanpageFb}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="Instagram"
                      label="Instagram"
                      value={formik.values.Instagram}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Instagram && Boolean(formik.errors.Instagram)}
                      helperText={formik.touched.Instagram && formik.errors.Instagram}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="Youtube"
                      label="Youtube"
                      value={formik.values.Youtube}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Youtube && Boolean(formik.errors.Youtube)}
                      helperText={formik.touched.Youtube && formik.errors.Youtube}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="ZaloWeb"
                      label="ZaloWeb"
                      value={formik.values.ZaloWeb}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.ZaloWeb && Boolean(formik.errors.ZaloWeb)}
                      helperText={formik.touched.ZaloWeb && formik.errors.ZaloWeb}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="Tiktok"
                      label="Tiktok"
                      value={formik.values.Tiktok}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Tiktok && Boolean(formik.errors.Tiktok)}
                      helperText={formik.touched.Tiktok && formik.errors.Tiktok}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="zalo"
                      label="Zalo"
                      value={formik.values.zalo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.zalo && Boolean(formik.errors.zalo)}
                      helperText={formik.touched.zalo && formik.errors.zalo}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="LinkWebConnect"
                      label="Liên kết website"
                      value={formik.values.LinkWebConnect}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.LinkWebConnect && Boolean(formik.errors.LinkWebConnect)}
                      helperText={formik.touched.LinkWebConnect && formik.errors.LinkWebConnect}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
              </TabPanel>
            </Box>
            <Stack
              sx={{
                display: inputSelect === 'all' ? 'none' : 'flex',
              }}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              mt={2}
              spacing={2}
            >
              <Button variant="contained" color="inherit" onClick={() => setInputSelect('all')}>
                Chỉnh sửa
              </Button>
            </Stack>
            <Stack
              sx={{
                display: inputSelect === 'all' ? 'flex' : 'none',
              }}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              mt={2}
              spacing={2}
            >
              <Button variant="outlined" color="inherit" onClick={() => setInputSelect('')}>
                Hủy
              </Button>
              <Button variant="contained" color="inherit" onClick={handleSubmit}>
                Lưu
              </Button>
            </Stack>
          </Card>
        </form>
      )}
    </Container>
  );
}
