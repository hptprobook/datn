import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  getConfigWebsite,
  updateConfigWebsite,
} from 'src/redux/slices/settingSlices';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import LoadingHeader from 'src/components/loading/loading-header';
import TitlePage from 'src/components/page/title';
import EditableField from '../edit-field';
// ----------------------------------------------------------------------
const configSchema = Yup.object().shape({
  FanpageFb: Yup.string().url('URL không hợp lệ'),
  ZaloWeb: Yup.string().url('URL không hợp lệ'),
  Instagram: Yup.string().url('URL không hợp lệ'),
  Youtube: Yup.string().url('URL không hợp lệ'),
  Tiktok: Yup.string().url('URL không hợp lệ'),
  LinkWebConnect: Yup.string().url('URL không hợp lệ'),
  ggSearchConsole: Yup.string().typeError('Google Search Console phải là một chuỗi văn bản.'),

  metaTitle: Yup.string()
    .trim()
    .min(1, 'Tiêu đề meta phải có ít nhất 1 ký tự.')
    .typeError('Tiêu đề meta phải là một chuỗi văn bản.'),

  metaDescription: Yup.string()
    .trim()
    .typeError('Mô tả meta phải là một chuỗi văn bản.')
    .min(1, 'Mô tả meta phải có ít nhất 1 ký tự.'),

  metaKeywords: Yup.string().typeError('Từ khóa meta phải là một chuỗi văn bản.'),

  metaRobots: Yup.string()
    .oneOf(
      ['index', 'noindex', 'follow', 'nofollow'],
      'Meta robots phải là một trong các giá trị sau: index, noindex, follow, nofollow.'
    )
    .default('index')
    .trim()
    .required('Meta robots không được để trống.')
    .typeError('Meta robots phải là một chuỗi văn bản.'),

  metaOGImg: Yup.string()
    .trim()
    .min(1, 'Hình ảnh OG meta phải có ít nhất 1 ký tự.')
    .typeError('Hình ảnh OG meta phải là một chuỗi văn bản.'),
});

export default function SeoPage() {
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
      eventUrl: config.eventUrl || '',
      hotline: config.hotline || '',
      zalo: config.zalo || '',
      nameBank: config.nameBank || '',
      numberBank: config.numberBank || '',
      nameholderBank: config.nameholderBank || '',
      logo: config.logo || '',
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
      {status === 'loading' && <LoadingFull />}
      {statusUpdate === 'loading' && <LoadingHeader />}
      <Stack direction="column" justifyContent="flex-start" spacing={2}>
        <TitlePage title="Cài đặt SEO" onClick={() => dispatch(getConfigWebsite())} />
        {status === 'successful' && formik.initialValues && (
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="column" spacing={2}>
              <Card sx={{ p: 3 }}>
                <TitleStoreCard
                  handleSubmit={handleSubmit}
                  setInputSelect={setInputSelect}
                  label="Thông tin SEO"
                  inputSelect={inputSelect}
                  selectLabel="seo"
                />
                <Grid2 container spacing={2}>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="metaTitle"
                      label="Tiêu đề meta"
                      value={formik.values.metaTitle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
                      error={formik.touched.metaTitle && Boolean(formik.errors.metaTitle)}
                      helperText={formik.touched.metaTitle && formik.errors.metaTitle}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="metaDescription"
                      label="Mô tả meta"
                      value={formik.values.metaDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
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
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="metaKeywords"
                      label="Từ khóa meta"
                      value={formik.values.metaKeywords}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
                      error={formik.touched.metaKeywords && Boolean(formik.errors.metaKeywords)}
                      helperText={formik.touched.metaKeywords && formik.errors.metaKeywords}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="metaRobots"
                      label="Meta Robots"
                      value={formik.values.metaRobots}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
                      error={formik.touched.metaRobots && Boolean(formik.errors.metaRobots)}
                      helperText={formik.touched.metaRobots && formik.errors.metaRobots}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>

                  <Grid2 xs={12} md={4}>
                    <EditableField
                      name="metaOGImg"
                      label="Hình ảnh OG meta"
                      value={formik.values.metaOGImg}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
                      error={formik.touched.metaOGImg && Boolean(formik.errors.metaOGImg)}
                      helperText={formik.touched.metaOGImg && formik.errors.metaOGImg}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 xs={4}>
                    <EditableField
                      name="ggSearchConsole"
                      label="Google Search Console"
                      value={formik.values.ggSearchConsole}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      selectLabel="seo"
                      error={
                        formik.touched.ggSearchConsole && Boolean(formik.errors.ggSearchConsole)
                      }
                      helperText={formik.touched.ggSearchConsole && formik.errors.ggSearchConsole}
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
