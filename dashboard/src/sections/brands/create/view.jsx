/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  Button,
  Select,
  Switch,
  MenuItem,
  FormGroup,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { handleToast } from 'src/hooks/toast';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { setStatus, createWithImage } from 'src/redux/slices/brandSlices';
import LoadingFull from 'src/components/loading/loading-full';
import { schema, productCategories } from '../utils';
// ----------------------------------------------------------------------
export default function BrandCreatePage() {
  const status = useSelector((state) => state.brands.statusCreate);
  const err = useSelector((state) => state.brands.error);
  const dispatch = useDispatch();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  useEffect(() => {
    if (status === 'successful') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      formik.resetForm();
      handleToast('success', 'Tạo nhãn hàng thành công!');
    }
    if (status === 'failed') {
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      handleToast('error', err.messages ? err.messages : 'Có lỗi xảy ra');
    }
  }, [status, err, dispatch]);
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      category: '',
      website: '',
      description: '',
      status: true,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!uploadedImageUrl) {
        handleToast('error', 'Vui lòng tải ảnh lên');
        return;
      }
      dispatch(
        createWithImage({
          file: uploadedImageUrl,
          data: values,
        })
      );
      setUploadedImageUrl(null);
    },
  });
  const handleChangeUploadImg = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'image',
      });
    }
  }, []);

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nhãn hàng mới</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Grid2 container spacing={2}>
            <Grid2 xs={8} container spacing={2}>
              <Grid2 xs={12}>
                <Typography variant="h5">Thông tin nhãn hàng</Typography>
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  label="Tên nhãn hàng"
                  name="name"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  label="Slug"
                  name="slug"
                  onBlur={formik.handleBlur}
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                />
              </Grid2>
              <Grid2 xs={8}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  onBlur={formik.handleBlur}
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  error={formik.touched.website && Boolean(formik.errors.website)}
                  helperText={formik.touched.website && formik.errors.website}
                />
              </Grid2>
              <Grid2 xs={4}>
                <FormGroup>
                  <FormControlLabel
                    sx={{ m: 0 }}
                    control={
                      <Switch
                        name="status"
                        checked={formik.values.status}
                        onChange={formik.handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="Trạng thái"
                  />
                </FormGroup>
              </Grid2>
              <Grid2 xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Danh mục</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formik.values.category}
                    label="Danh mục"
                    name="category"
                    onChange={formik.handleChange}
                  >
                    {productCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.category && formik.errors.category
                      ? formik.errors.category
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  onBlur={formik.handleBlur}
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid2>
            </Grid2>
            <Grid2
              container
              spacing={2}
              xs={4}
              sx={{
                height: 'fit-content',
              }}
            >
              <Grid2 xs={12}>
                <Typography variant="h5">Ảnh đại diện</Typography>
              </Grid2>
              <Grid2 xs={12}>
                <ImageDropZone singleFile handleUpload={handleChangeUploadImg} />
              </Grid2>
            </Grid2>
            <Grid2 xs={12}>
              <Button type="submit" variant="contained" color="inherit">
                Lưu
              </Button>
            </Grid2>
          </Grid2>
        </Card>
      </form>
    </Container>
  );
}
