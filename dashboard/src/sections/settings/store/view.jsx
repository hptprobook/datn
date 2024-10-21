import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Button, IconButton } from '@mui/material';
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
import Iconify from 'src/components/iconify';
import LoadingFull from 'src/components/loading/loading-full';
import LoadingHeader from 'src/components/loading/loading-header';
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
      handleToast('error', error);
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">Thông tin cửa hàng</Typography>
          <IconButton onClick={() => dispatch(getConfigWebsite())}>
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
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
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Social"
                  inputSelect={inputSelect}
                  selectLabel="social"
                />
                <Grid2 container spacing={2}>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="FanpageFb"
                      label="Fanpage Facebook"
                      value={formik.values.FanpageFb}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.FanpageFb && Boolean(formik.errors.FanpageFb)}
                      helperText={formik.touched.FanpageFb && formik.errors.FanpageFb}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="Instagram"
                      label="Instagram"
                      value={formik.values.Instagram}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.Instagram && Boolean(formik.errors.Instagram)}
                      helperText={formik.touched.Instagram && formik.errors.Instagram}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="Youtube"
                      label="Youtube"
                      value={formik.values.Youtube}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.Youtube && Boolean(formik.errors.Youtube)}
                      helperText={formik.touched.Youtube && formik.errors.Youtube}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="ZaloWeb"
                      label="ZaloWeb"
                      value={formik.values.ZaloWeb}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.ZaloWeb && Boolean(formik.errors.ZaloWeb)}
                      helperText={formik.touched.ZaloWeb && formik.errors.ZaloWeb}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="Tiktok"
                      label="Tiktok"
                      value={formik.values.Tiktok}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.Tiktok && Boolean(formik.errors.Tiktok)}
                      helperText={formik.touched.Tiktok && formik.errors.Tiktok}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="zalo"
                      label="Zalo"
                      value={formik.values.zalo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.zalo && Boolean(formik.errors.zalo)}
                      helperText={formik.touched.zalo && formik.errors.zalo}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="LinkWebConnect"
                      label="Liên kết website"
                      value={formik.values.LinkWebConnect}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="social"
                      error={formik.touched.LinkWebConnect && Boolean(formik.errors.LinkWebConnect)}
                      helperText={formik.touched.LinkWebConnect && formik.errors.LinkWebConnect}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
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
        display: inputSelect === selectLabel ? 'none' : 'flex',
      }}
      onClick={() => setInputSelect(selectLabel)}
    >
      Chỉnh sửa
    </Button>

    {/* Stack for save/cancel buttons in edit mode */}
    <Stack
      sx={{
        display: inputSelect === selectLabel ? 'flex' : 'none',
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
  inputSelect: PropTypes.string.isRequired,
  selectLabel: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
