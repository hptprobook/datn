/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  Button,
  FormHelperText,
  SpeedDial,
  TextField,
} from '@mui/material';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { create, setStatus } from 'src/redux/slices/couponSlice';
import {useCallback, useEffect, useState } from 'react';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import Iconify from 'src/components/iconify';
import { slugify } from 'src/utils/format-text';
import {  schema } from '../utils';

// ----------------------------------------------------------------------

export default function CreateWebBannerPage() {

  const [thumbnail, setThumbnail] = useState(null);
  const status = useSelector((state) => state.coupons.statusCreate);
  const err = useSelector((state) => state.coupons.error);
  const [errorThumbnail, setErrorThumbnail] = useState(null);

  const dispatch = useDispatch();
  const handleCreateSlug = (e) => {
    formik.setFieldValue('title', e.target.value);
    const slug = slugify(e.target.value);
    formik.setFieldValue('url', slug);
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
      title: '',
      description: '',
      url: '',
      image: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const data = { ...values };

      dispatch(create(data));
    },
  });


  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <SpeedDial
        ariaLabel="Lưu bảng quảng cáo"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một bảng quảng cáo</Typography>
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
