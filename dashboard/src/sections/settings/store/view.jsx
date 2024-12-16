import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Button } from '@mui/material';
import { useRef, useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  getConfigWebsite,
  updateConfigWebsite,
  uploadConfigWebsite,
} from 'src/redux/slices/settingSlices';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import LoadingFull from 'src/components/loading/loading-full';
import LoadingHeader from 'src/components/loading/loading-header';
import TitlePage from 'src/components/page/title';
import TinyEditor from 'src/components/editor/tinyEditor';
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
  eventUrl: Yup.string().min(2, 'Đường dẫn sự kiện quá ngắn').max(255, 'Đường dẫn sự kiện quá dài'),
  footerThanks: Yup.string()
    .min(50, 'Lời cảm ơn quá ngắn')
    .max(1000, 'Lời cảm ơn quá dài')
    .required('Lời cảm ơn không được để trống'),
});

export default function StorePage() {
  const [config, setConfig] = useState({});
  const dispatch = useDispatch();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const data = useSelector((state) => state.settings.web);
  const status = useSelector((state) => state.settings.statusWeb);
  const statusUpdate = useSelector((state) => state.settings.statusUpdateWeb);
  const error = useSelector((state) => state.settings.error);
  const handleChangeUploadImg = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'logo',
      });
    }
  }, []);
  const handleChangeUpDarkLogo = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'darkLogo',
      });
    }
  }, []);
  const handleChangeUpIcon = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'icon',
      });
    }
  }, []);
  const handleChangeUpEventBanner = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'eventBanner',
      });
    }
  }, []);
  const handleChangeUpLoginScreen = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'loginScreen',
      });
    }
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nameCompany: config.nameCompany || '',
      website: config.website || '',
      address: config.address || '',
      email: config.email || '',
      phone: config.phone || '',
      eventUrl: config.eventUrl || '',
      hotline: config.hotline || '',
      zalo: config.zalo || '',
      nameBank: config.nameBank || '',
      numberBank: config.numberBank || '',
      nameholderBank: config.nameholderBank || '',
      logo: config.logo || '',
      icon: config.icon || '',
      FanpageFb: config.FanpageFb || '',
      metaTitle: config.metaTitle || '',
      metaDescription: config.metaDescription || '',
      metaKeywords: config.metaKeywords || '',
      metaRobots: config.metaRobots || '',
      metaOGImg: config.metaOGImg || '',
      ggSearchConsole: config.ggSearchConsole || '',
      ZaloWeb: config.ZaloWeb || '',
      Instagram: config.Instagram || '',
      Youtube: config.Youtube || '',
      Tiktok: config.Tiktok || '',
      LinkWebConnect: config.LinkWebConnect || '',
      footerThanks: config.footerThanks || '',
    },
    validationSchema: configSchema,
  });
  useEffect(() => {
    dispatch(getConfigWebsite());
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
      dispatch(setStatus({ key: 'statusUpdateWeb', value: 'idle' }));
    }
    if (statusUpdate === 'failed') {
      console.log(error);
      handleToast('error', error?.messages || 'Có lỗi xảy ra');
    }
  }, [statusUpdate, data, error, dispatch]);
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
  const handleUpload = () => {
    if (uploadedImageUrl) {
      dispatch(uploadConfigWebsite(uploadedImageUrl));
      setUploadedImageUrl(null);
    } else {
      handleToast('error', 'Chưa chọn ảnh');
    }
  };
  const [inputSelect, setInputSelect] = useState('');
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusUpdate === 'loading' && <LoadingHeader />}
      <Stack direction="column" justifyContent="flex-start" spacing={2}>
        <TitlePage title="Cài đặt cửa hàng" onClick={() => dispatch(getConfigWebsite())} />
        {status === 'successful' && formik.initialValues && (
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="column" spacing={2}>
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Thông tin cơ bản"
                  inputSelect={inputSelect}
                  selectLabel="info"
                />
                <Grid2 spacing={2} container>
                  <Grid2 container spacing={2} xs={8}>
                    <Grid2 xs={6}>
                      <EditableField
                        name="nameCompany"
                        label="Tên công ty"
                        value={formik.values.nameCompany}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectLabel="info"
                        error={formik.touched.nameCompany && Boolean(formik.errors.nameCompany)}
                        helperText={formik.touched.nameCompany && formik.errors.nameCompany}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={6}>
                      <EditableField
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectLabel="info"
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
                        name="website"
                        label="Website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectLabel="info"
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
                        selectLabel="info"
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>

                    <Grid2 xs={6}>
                      <EditableField
                        name="phone"
                        label="Số điện thoại"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectLabel="info"
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                    <Grid2 xs={6}>
                      <EditableField
                        name="hotline"
                        label="Hotline"
                        value={formik.values.hotline}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectLabel="info"
                        error={formik.touched.hotline && Boolean(formik.errors.hotline)}
                        helperText={formik.touched.hotline && formik.errors.hotline}
                        inputSelect={inputSelect}
                        setInputSelect={setInputSelect}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                      />
                    </Grid2>
                  </Grid2>

                  <Grid2 xs={4}>
                    <ImageDropZone
                      handleUpload={handleChangeUploadImg}
                      singleFile
                      defaultImg={config.logo}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      mt={2}
                      spacing={2}
                    >
                      <Button
                        color="inherit"
                        onClick={() => handleToast('info', 'Chức năng đang phát triển')}
                      >
                        Chọn ảnh từ thư viện
                      </Button>
                      <Button
                        sx={{ display: uploadedImageUrl === null ? 'none' : 'block' }}
                        variant="contained"
                        color="inherit"
                        onClick={handleUpload}
                      >
                        Lưu
                      </Button>
                    </Stack>
                  </Grid2>
                </Grid2>
              </Card>
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Media"
                />
                <Grid2 spacing={2} container>
                  <Grid2 xs={4}>
                    <Stack direction="column" spacing={2}>
                      <Typography variant="h6">Icon</Typography>
                      <ImageDropZone
                        handleUpload={handleChangeUpIcon}
                        singleFile
                        defaultImg={config.icon}
                      />
                      <Button
                        sx={{ display: uploadedImageUrl?.name === 'icon' ? 'block' : 'none' }}
                        variant="contained"
                        color="inherit"
                        onClick={handleUpload}
                      >
                        Lưu
                      </Button>
                    </Stack>
                  </Grid2>
                  <Grid2 xs={4}>
                    <Typography variant="h6">Logo nền tối</Typography>
                    <ImageDropZone
                      handleUpload={handleChangeUpDarkLogo}
                      singleFile
                      defaultImg={config.darkLogo}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      mt={2}
                      spacing={2}
                    >
                      <Button
                        sx={{ display: uploadedImageUrl?.name === 'darkLogo' ? 'block' : 'none' }}
                        variant="contained"
                        color="inherit"
                        onClick={handleUpload}
                      >
                        Lưu
                      </Button>
                    </Stack>
                  </Grid2>
                  <Grid2 xs={4}>
                    <Typography variant="h6">Màn hình đăng nhập</Typography>
                    <ImageDropZone
                      handleUpload={handleChangeUpLoginScreen}
                      singleFile
                      defaultImg={config.loginScreen}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      mt={2}
                      spacing={2}
                    >
                      <Button
                        sx={{
                          display: uploadedImageUrl?.name === 'loginScreen' ? 'block' : 'none',
                        }}
                        variant="contained"
                        color="inherit"
                        onClick={handleUpload}
                      >
                        Lưu
                      </Button>
                    </Stack>
                  </Grid2>
                </Grid2>
              </Card>
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Banner sự kiện"
                />
                <Grid2 spacing={2} container>
                  <Grid2 xs={6}>
                    <EditableField
                      name="eventUrl"
                      label="Đường dẫn sự kiện"
                      value={formik.values.eventUrl}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="banner"
                      error={formik.touched.eventUrl && Boolean(formik.errors.eventUrl)}
                      helperText={formik.touched.eventUrl && formik.errors.eventUrl}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={4}>
                    <Stack direction="column" spacing={2}>
                      <ImageDropZone
                        handleUpload={handleChangeUpEventBanner}
                        singleFile
                        defaultImg={config.eventBanner}
                      />
                      <Button
                        sx={{
                          display: uploadedImageUrl?.name === 'eventBanner' ? 'block' : 'none',
                        }}
                        variant="contained"
                        color="inherit"
                        onClick={handleUpload}
                      >
                        Lưu
                      </Button>
                    </Stack>
                  </Grid2>
                </Grid2>
              </Card>
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Thông tin ngân hàng"
                  inputSelect={inputSelect}
                  selectLabel="bank"
                />
                <Grid2 container spacing={2}>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="nameBank"
                      label="Tên ngân hàng"
                      value={formik.values.nameBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="bank"
                      error={formik.touched.nameBank && Boolean(formik.errors.nameBank)}
                      helperText={formik.touched.nameBank && formik.errors.nameBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="numberBank"
                      label="Số tài khoản"
                      value={formik.values.numberBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="bank"
                      error={formik.touched.numberBank && Boolean(formik.errors.numberBank)}
                      helperText={formik.touched.numberBank && formik.errors.numberBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="nameholderBank"
                      label="Tên chủ tài khoản"
                      value={formik.values.nameholderBank}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="bank"
                      error={formik.touched.nameholderBank && Boolean(formik.errors.nameholderBank)}
                      helperText={formik.touched.nameholderBank && formik.errors.nameholderBank}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
              </Card>
              <Card
                sx={{
                  p: 3,
                }}
              >
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Lời cảm ơn"
                  inputSelect={inputSelect}
                  selectLabel="footerThanks"
                />
                <TinyEditor
                  onChange={(value) => formik.setFieldValue('footerThanks', value)}
                  initialValue={formik.values.footerThanks}
                  error={formik.touched.footerThanks && Boolean(formik.errors.footerThanks)}
                  disabled={inputSelect !== 'footerThanks'}
                />
                <Typography variant="caption" color="textSecondary">
                  {formik.touched.footerThanks && formik.errors.footerThanks}
                </Typography>
              </Card>
            </Stack>
          </form>
        )}
      </Stack>
    </Container>
  );
}
const TitleStoreCard = ({ handleSubmit, setInputSelect, inputSelect, selectLabel, label }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h6">{label}</Typography>

    {/* Button to enable edit mode */}
    <Button
      variant="contained"
      color="inherit"
      sx={{
        display: inputSelect === selectLabel ? 'none' : selectLabel && 'block',
      }}
      onClick={() => setInputSelect(selectLabel)}
    >
      Chỉnh sửa
    </Button>

    {/* Stack for save/cancel buttons in edit mode */}
    <Stack
      sx={{
        display: inputSelect === selectLabel && selectLabel ? 'flex' : 'none',
      }}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      spacing={2}
    >
      <Button color="error" onClick={() => setInputSelect('')}>
        Hủy
      </Button>
      <Button variant="contained" color="inherit" onClick={handleSubmit}>
        Lưu
      </Button>
    </Stack>
  </Stack>
);
TitleStoreCard.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setInputSelect: PropTypes.func.isRequired,
  inputSelect: PropTypes.string,
  selectLabel: PropTypes.string,
  label: PropTypes.string.isRequired,
};
