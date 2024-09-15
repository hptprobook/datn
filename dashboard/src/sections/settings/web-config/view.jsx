import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, IconButton, Tab, Tabs, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getConfigWebsite } from 'src/redux/slices/settingSlices';
import { useFormik } from 'formik';
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
  linkWebConnect: Yup.string().url('URL không hợp lệ'),
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
      {value === index && <Box sx={{ p: 3, width: '100%' }}>{children}</Box>}
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

  useEffect(() => {
    dispatch(getConfigWebsite());
  }, [dispatch]);
  useEffect(() => {
    if (status === 'succeeded') {
      setConfig(data);
    }
  }, [data, status]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nameCompany: config.nameCompany,
      website: config.website,
      address: config.address,
      email: config.email,
      phone: config.phone,
      hotline: config.hotline,
      zalo: config.zalo,
      nameBank: config.nameBank,
      numberBank: config.numberBank,
      nameholderBank: config.nameholderBank,
      logo: config.logo,
      FanpageFb: config.FanpageFb,
      ZaloWeb: config.ZaloWeb,
      Instagram: config.Instagram,
      Youtube: config.Youtube,
      Tiktok: config.Tiktok,
      linkWebConnect: config.linkWebConnect,
    },
    validationSchema: configSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCancel = () => {
    formik.resetForm();
    setInputSelect('');
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
      {status === 'succeeded' && (
        <form onSubmit={formik.handleSubmit}>
          <Card
            sx={{
              p: 3,
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
            <TabPanel value={value} index={0}>
              <Grid2 spacing={2} container>
                <Grid2 container spacing={2} xs={8}>
                  <Grid2 xs={12} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      sx={{ flexGrow: 1 }}
                      name="nameCompany"
                      label="Tên công ty"
                      variant="outlined"
                      value={formik.values.nameCompany}
                      onChange={formik.handleChange}
                      error={formik.touched.nameCompany && Boolean(formik.errors.nameCompany)}
                      helperText={formik.touched.nameCompany && formik.errors.nameCompany}
                      disabled={inputSelect !== 'name'}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{
                        display: inputSelect === 'name' ? 'flex' : 'none',
                      }}
                    >
                      <Button variant="text" color="inherit" onClick={handleCancel}>
                        Hủy
                      </Button>
                      <Button variant="contained" color="inherit">
                        Lưu
                      </Button>
                    </Stack>
                    <IconButton
                      color="inherit"
                      aria-label="Chỉnh sửa"
                      variant="contained"
                      sx={{
                        display: inputSelect === 'name' ? 'none' : 'block',
                        width: 40,
                        height: 40,
                      }}
                      onClick={() => setInputSelect('name')}
                    >
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                  </Grid2>
                </Grid2>
              </Grid2>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <img src="http://localhost:3000/uploads/1726331121750-168549435.jpg" alt="logo" />
            </TabPanel>
            <TabPanel value={value} index={2}>
           {config.FanpageFb}
            </TabPanel>
          </Card>
        </form>
      )}
    </Container>
  );
}
