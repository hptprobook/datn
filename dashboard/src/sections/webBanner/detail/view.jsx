/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Tab,
  Card,
  Chip,
  Tabs,
  Select,
  Button,
  MenuItem,
  TextField,
  SpeedDial,
  InputLabel,
  IconButton,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { slugify } from 'src/utils/format-text';
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import { update, setStatus, fetchById } from 'src/redux/slices/webBannerSlice';
import LoadingFull from 'src/components/loading/loading-full';
// import { AutoSelect } from '../auto-select';

import { isValidObjectId } from 'src/utils/check';

import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { schema } from '../utils';

// ----------------------------------------------------------------------

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

export default function DetailBlogView() {
  const { id } = useParams();
  const route = useRouter();
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(fetchById({ id }));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/blogs');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const [thumbnail, setThumbnail] = useState(null);
  const [errorThumbnail, setErrorThumbnail] = useState(null);

  const dispatch = useDispatch();

  const status = useSelector((state) => state.webBanners.statusUpdate);
  const webBanner = useSelector((state) => state.webBanners.webBanner);
  const error = useSelector((state) => state.webBanners.error);
  const statusGetWebBanner = useSelector((state) => state.webBanners.status);
console.log(error);
  const formik = useFormik({
    initialValues: {
      title: webBanner?.title || '',
      description: webBanner?.description  ||'',
      url: webBanner?.url || '',
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      if (thumbnail !== null) {
        values.thumbnail = thumbnail;
      }
  
      console.log(values);

      dispatch(update({ id , data: values }));
    },
  });

  const handleCreateSlug = (e) => {
    formik.setFieldValue('title', e.target.value);
    const slug = slugify(e.target.value);
    formik.setFieldValue('slug', slug);
  };
  const handleChangeUploadThumbnail = useCallback((files) => {
    if (files) {
      setErrorThumbnail('');
      setThumbnail(files);
    } else {
      setThumbnail(null);
    }
  }, []);

  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Cập nhật bài viết thành công');
    }
    if (status === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra');
    }

    dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
    dispatch(setStatus({ key: 'error', value: 'idle' }));
  }, [status, error, dispatch]);
  return (
    <Container>
    {status === 'loading' && <LoadingFull />}
    {statusGetWebBanner === 'loading' && <LoadingFull />}

    <SpeedDial
      ariaLabel="Lưu bảng quảng cáo"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      onClick={() => formik.handleSubmit()}
      icon={<Iconify icon="eva:save-fill" />}
    />
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h4">Chỉnh sửa bảng quảng cáo</Typography>
        <IconButton
          aria-label="load"
          variant="contained"
          color="inherit"
          onClick={() => dispatch(fetchById({ id }))}
        >
          <Iconify icon="mdi:reload" />
        </IconButton>
      </Stack>
    </Stack>
    <form onSubmit={formik.handleSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 xs={8}>
          <Stack spacing={3}>
            <Card
              sx={{
                padding: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>
                Thông tin cơ bản
              </Typography>
              <Grid2 container spacing={3}>
                <Grid2 xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề"
                    variant="outlined"
                    name="title"
                    value={formik.values.title}
                    onChange={(e) => handleCreateSlug(e)}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid2>
                <Grid2 xs={12}>
                  <TextField
                    fullWidth
                    label="Đường dẫn"
                    variant="outlined"
                    name="url"
                    value={formik.values.url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.url && Boolean(formik.errors.url)}
                    helperText={formik.touched.url && formik.errors.url}
                  />
                </Grid2>
              </Grid2>
            </Card>
            <Card
              sx={{
                padding: 3,
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Mô tả bảng quảng cáo
                </Typography>
                <TextField
                  fullWidth
                  label="description"
                  variant="outlined"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Stack>
              <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
                <Button type="button" onClick={() => formik.handleSubmit()} variant="contained" color="inherit">
                  Lưu
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid2>
        <Grid2 xs={4}>
          <Card
            sx={{
              padding: 3,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Hình ảnh đại diện bài viết
              </Typography>
              <ImageDropZone
                error={errorThumbnail}
                defaultImg={`${backendUrl}${webBanner?.image}`}
                singleFile
                handleUpload={handleChangeUploadThumbnail}
              />
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </form>
  </Container>
  );
}