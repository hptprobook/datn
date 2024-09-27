/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Card,
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
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, createCategory, fetchAllCategories } from 'src/redux/slices/categorySlices';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import TinyEditor from 'src/components/editor/tinyEditor';
import LoadingFull from 'src/components/loading/loading-full';
import { slugify } from 'src/utils/format-text';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Tên Danh mục là bắt buộc')
    .typeError('Tên Danh mục không hợp lệ')
    .min(2, 'Tên Danh mục phải chứa ít nhất 2 ký tự')
    .max(255, 'Tên Danh mục không được vượt quá 255 ký tự'),
  slug: Yup.string()
    .required('Slug là bắt buộc')
    .typeError('Slug không hợp lệ')
    .min(2, 'Slug phải chứa ít nhất 2 ký tự')
    .max(255, 'Slug không được vượt quá 255 ký tự'),
  status: Yup.string().required('Trạng thái là bắt buộc'), // Add validation for status
});

const CreateCategoryView = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const statusGetCategories = useSelector((state) => state.categories.status);
  const statusCreate = useSelector((state) => state.categories.statusCreate);
  const error = useSelector((state) => state.categories.error);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      parentId: '',
      status: true,
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = JSON.parse(JSON.stringify(values));

      if (!uploadedImageUrl) {
        handleToast('error', 'Hình ảnh không được để trống');
        return;
      }
      if (data.parentId === '') {
        data.parentId = 'ROOT';
        data.order = 0;
      } else {
        const parentCategory = categories.find((category) => category._id === data.parentId);
        if (parentCategory) {
          if (parentCategory.order === 1) {
            data.order = 2;
          } else {
            data.order = 1;
          }
        }
      }

      if (data.description === '') {
        handleToast('error', 'Mô tả không được để trống');
        return;
      }
      dispatch(createCategory({ file: uploadedImageUrl, data }));
    },
  });

  useEffect(() => {
    dispatch(fetchAllCategories());
    if (statusCreate === 'successful') {
      handleToast('success', 'Tạo Danh mục thành công');
      formik.resetForm();
      setUploadedImageUrl(null);
    } else if (statusCreate === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra khi tạo Danh mục');
      dispatch(setStatus({ key: 'error', value: null }));
    }
    dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
  }, [statusCreate, dispatch, error, formik]);

  useEffect(() => {
    if (statusGetCategories === 'idle') {
      dispatch(fetchAllCategories(true));
    } else if (statusGetCategories === 'failed') {
      handleToast('error', 'Có lõi xảy ra khi lấy danh sách danh mục');
    }
  }, [statusGetCategories, dispatch, error, categories]);

  const handleChangeUploadImg = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'image',
      });
    }
  }, []);

  const handleEditorChange = (values) => {
    formik.setFieldValue('description', values);
  };
  const handleNameChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue('name', value); // Cập nhật giá trị name
    formik.setFieldValue('slug', slugify(value)); // Tạo slug tự động từ name
  };
  // Filter categories to include only those with parentId as ROOT and their direct children
  return (
    <Container>
      {statusCreate === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một Danh mục mới</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Card
          sx={{
            padding: 3,
          }}
        >
          <Grid2 container spacing={2}>
            <Grid2 xs={8} container spacing={2}>
              <Grid2 xs={12}>
                <Typography variant="h6">Thông tin Danh mục</Typography>
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  variant="outlined"
                  label="Tên Danh mục"
                  required
                  autoFocus
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  id="slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  variant="outlined"
                  label="Slug"
                  required
                />
              </Grid2>
              <Grid2 xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Danh mục cha</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formik.values.parentId}
                    label="Danh mục cha"
                    name="parentId"
                    onChange={formik.handleChange}
                  >
                    {categories?.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        <Typography
                          variant="body2"
                          fontWeight={category.order === 0 ? '700' : 'normal'}
                        >
                          {category.name}
                        </Typography>
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
              <Grid2 xs={6} display="flex" alignItems="center">
                <FormGroup>
                  <FormControlLabel
                    sx={{ m: 0 }}
                    control={<Switch name="status" inputProps={{ 'aria-label': 'controlled' }} />}
                    label="Trạng thái"
                  />
                </FormGroup>
              </Grid2>
              <Grid2 xs={12}>
                <TinyEditor onChange={handleEditorChange} />
              </Grid2>
              <Grid2 xs={12}>
                <Button type="submit" color="inherit" variant="contained">
                  Tạo Danh mục
                </Button>
              </Grid2>
            </Grid2>
            <Grid2 xs={4}>
              <Grid2 xs={12}>
                <Typography variant="h6">Hình ảnh</Typography>
              </Grid2>
              <Grid2 xs={12}>
                <ImageDropZone singleFile handleUpload={handleChangeUploadImg} />
              </Grid2>
            </Grid2>
          </Grid2>
        </Card>
      </form>
    </Container>
  );
};

export default CreateCategoryView;
