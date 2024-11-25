/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Card,
  Chip,
  Select,
  Button,
  MenuItem,
  TextField,
  SpeedDial,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { slugify } from 'src/utils/format-text';
import TinyEditor from 'src/components/editor/tinyEditor';
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, createBlog } from 'src/redux/slices/blogSlice';
import LoadingFull from 'src/components/loading/loading-full';
// import { AutoSelect } from '../auto-select';

// ----------------------------------------------------------------------
const blogSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tên bài viết là bắt buộc')
    .min(5, 'Tên bài viết phải ít nhất 5 ký tự')
    .max(255, 'Tên bài viết không được quá 255 ký tự'),
  slug: Yup.string().min(5, 'Slug phải ít nhất 5 ký tự').max(255, 'Slug không được quá 255 ký tự'),
  content: Yup.string()
    // .required('Nội dung là bắt buộc')
    .min(5, 'Nội dung  phải ít nhất 5 ký tự')
    .max(10000, 'Nội dung  không được quá 10000 ký tự'),
  metaDescription: Yup.string().max(255, 'Meta Description không được quá 255 ký tự'),
  metaKeywords: Yup.string().max(255, 'Meta Keywords không được quá 255 ký tự'),
});

export default function CreateBlogPage() {
  const [thumbnail, setThumbnail] = useState(null);
  const [errorThumbnail, setErrorThumbnail] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const me = useSelector((state) => state.auth.auth);

  const dispatch = useDispatch();

  const status = useSelector((state) => state.blogs.statusCreate);
  const error = useSelector((state) => state.blogs.error);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      authID: me?._id,
      authName: me?.name,
      content: 'Đây là content của bài viết',
      slug: '',
      tags: [],
      status: 'public',
      metaDescription: '',
      metaKeywords: '',
    },
    enableReinitialize: true,
    validationSchema: blogSchema,
    onSubmit: (values) => {
      if (thumbnail === null) {
        setErrorThumbnail('Vui lòng chọn ảnh đại diện');
      }
      if (status === '' || status === null) {
        handleToast('error', 'Vui lòng chọn trạng thái');
        return;
      }
      if (tags.length === 1) {
        handleToast('error', 'Vui lòng nhập thêm tag');
        return;
      }
      values.thumbnail = thumbnail;
      values.tags = tags;
      console.log(values);

      dispatch(createBlog({ data: values }));
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
    if (status === 'failed') {
      handleToast('error', error.message);
    }
    if (status === 'successful') {
      handleToast('success', 'Tạo bài viết thành công');
      formik.resetForm();
      setTags([]);
      setThumbnail(null);
    }
    dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, dispatch]);
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <SpeedDial
        ariaLabel="Lưu bài viết"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một bài viết mới</Typography>
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
                      label="Tên bài viết"
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
                      label="Slug"
                      variant="outlined"
                      name="slug"
                      value={formik.values.slug}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.slug && Boolean(formik.errors.slug)}
                      helperText={formik.touched.slug && formik.errors.slug}
                    />
                  </Grid2>
                </Grid2>
              </Card>

              <Card sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', padding: 3 }}>
                <Stack spacing={3} sx={{ width: '100%' }}>
                  <FormControl fullWidth>
                    <InputLabel id="status-select-label">Trạng thái bài viết</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      name="status"
                      value={formik.values.status}
                      label="Trạng thái bài viết"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="public">Công khai</MenuItem>
                      <MenuItem value="private">Riêng tư</MenuItem>
                      <MenuItem value="waiting">Chờ duyệt</MenuItem>
                      <MenuItem value="reject">Từ chối</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="metaDescription"
                    name="metaDescription"
                    label="Meta Description"
                    value={formik.values.metaDescription}
                    onChange={formik.handleChange}
                    error={formik.touched.metaDescription && Boolean(formik.errors.metaDescription)}
                    helperText={formik.touched.metaDescription && formik.errors.metaDescription}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    id="metaKeywords"
                    name="metaKeywords"
                    label="Meta Keywords"
                    value={formik.values.metaKeywords}
                    onChange={formik.handleChange}
                    error={formik.touched.metaKeywords && Boolean(formik.errors.metaKeywords)}
                    helperText={formik.touched.metaKeywords && formik.errors.metaKeywords}
                    margin="normal"
                  />
                </Stack>
              </Card>
              <Card
                sx={{
                  padding: 3,
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Nội dung bài viết
                  </Typography>
                  <TinyEditor
                    error={formik.touched.content && Boolean(formik.errors.content)}
                    initialValue="Đây là Nội dung của bài viết"
                    onChange={(content) => formik.setFieldValue('content', content)}
                    height={200}
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                    {formik.touched.content && formik.errors.content ? formik.errors.content : ''}
                  </FormHelperText>
                </Stack>
                <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    onClick={() => formik.handleSubmit()}
                    variant="contained"
                    color="inherit"
                  >
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
                <Box>
                  <TextField
                    label="Nhập nhãn bài viết"
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth
                  />
                  <Box mt={2}>
                    {tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDelete(tag)}
                        style={{ marginRight: 5, marginBottom: 5 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Card>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
