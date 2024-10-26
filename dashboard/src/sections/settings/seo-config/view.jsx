import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Tab, Tabs, Button, IconButton } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, getConfigSeo, updateConfigSeo } from 'src/redux/slices/settingSlices';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import Iconify from 'src/components/iconify';
import EditableField from '../edit-field';
// ----------------------------------------------------------------------
const configSchema = Yup.object().shape({
  metaTitle: Yup.string().required('Tiêu đề không được để trống'),
  metaDescription: Yup.string().required('Mô tả không được để trống'),
  metaKeywords: Yup.string().required('Từ khóa không được để trống'),
  metaRobots: Yup.string().required('Thẻ không được để trống'),
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
export default function SeoConfigPage() {
  const [value, setValue] = useState(0);
  const [config, setConfig] = useState({});
  const dispatch = useDispatch();
  // const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const data = useSelector((state) => state.settings.seo);
  const status = useSelector((state) => state.settings.statusSeo);
  const statusUpdate = useSelector((state) => state.settings.statusUpdateSeo);
  const error = useSelector((state) => state.settings.error);
  // const handleChangeUploadImg = useCallback((files) => {
  //   if (files) {
  //     setUploadedImageUrl({
  //       file: files,
  //       name: 'logo',
  //     });
  //   }
  // }, []); // Ensure it only triggers when files change

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...data,
    },
    validationSchema: configSchema,
  });
  useEffect(() => {
    dispatch(getConfigSeo());
  }, [dispatch]);
  const formikRef = useRef(formik);

  useEffect(() => {
    if (status === 'successful' && data) {
      setConfig(data);
      formikRef.current.setValues(data);
    }
  }, [status, data]);
  useEffect(() => {
    if (statusUpdate === 'successful' && data) {
      handleToast('success', 'Cập nhật thành công');
      setInputSelect('');
      dispatch(setStatus({ key: 'statusUpdateSeo', value: 'idle' }));
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
    delete newValues._id; // Delete the '_id' property
    dispatch(updateConfigSeo({ values: newValues }));
  };
  const handleCancel = () => {
    formik.resetForm();
    setInputSelect('');
  };
  const handleUpdate = (name) => {
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
    dispatch(updateConfigSeo({ values }));
  };
  // const handleUpload = () => {
  //   if (uploadedImageUrl) {
  //     dispatch(uploadConfigWebsite(uploadedImageUrl));
  //     setUploadedImageUrl(null);
  //   } else {
  //     handleToast('error', 'Chưa chọn ảnh');
  //   }
  // };
  const [inputSelect, setInputSelect] = useState('');
  return (
    <Container>
      <Stack direction="row" alignItems="center" mb={5} spacing={1}>
        <Typography variant="h4">Thông tin Seo</Typography>
        <IconButton onClick={() => dispatch(getConfigSeo())}>
          <Iconify icon="mdi:reload" />
        </IconButton>
      </Stack>
      {status === 'successful' && formik.initialValues && (
        <form onSubmit={formik.handleSubmit}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Tabs
                orientation="vertical"
                variant="standard"
                value={value}
                onChange={handleChange}
                aria-label="Thông tin trang web"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Cơ bản" {...a11yProps(0)} />
                <Tab label="Nâng cao" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Typography variant="h6" mb={3}>
                  Thông tin cơ bản
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 xs={12}>
                    <EditableField
                      name="metaTitle"
                      label="Meta Title"
                      value={formik.values.metaTitle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.metaTitle && Boolean(formik.errors.metaTitle)}
                      helperText={formik.touched.metaTitle && formik.errors.metaTitle}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="metaDescription"
                      label="Meta Description"
                      value={formik.values.metaDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.metaDescription && Boolean(formik.errors.metaDescription)
                      }
                      helperText={formik.touched.metaDescription && formik.errors.metaDescription}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="metaKeywords"
                      label="Meta Keywords"
                      value={formik.values.metaKeywords}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.metaKeywords && Boolean(formik.errors.metaKeywords)}
                      helperText={formik.touched.metaKeywords && formik.errors.metaKeywords}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <EditableField
                      name="metaRobots"
                      label="Meta Robots"
                      value={formik.values.metaRobots}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.metaRobots && Boolean(formik.errors.metaRobots)}
                      helperText={formik.touched.metaRobots && formik.errors.metaRobots}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
              </TabPanel>
              {/* Thông tin thanh toán */}
              <TabPanel value={value} index={1}>
                <Typography variant="h6" mb={3}>
                  Thông tin nâng cao
                </Typography>
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
