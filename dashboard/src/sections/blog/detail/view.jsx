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
import TinyEditor from 'src/components/editor/tinyEditor';
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, updateBlog , fetchBlogById } from 'src/redux/slices/blogSlice';
import LoadingFull from 'src/components/loading/loading-full';
// import { AutoSelect } from '../auto-select';

import { isValidObjectId } from 'src/utils/check';
import { fetchAllUsers } from 'src/redux/slices/userSlice';

import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';

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
  authID: Yup.string().required('Tác giả là bắt buộc'),
  metaDescription: Yup.string().max(255, 'Meta Description không được quá 255 ký tự'),
  metaKeywords: Yup.string().max(255, 'Meta Keywords không được quá 255 ký tự'),
});
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

export default function DetailBlogView() {
  const { id } = useParams();
  const route = useRouter();
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(fetchBlogById({ id }));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/blogs');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const [thumbnail, setThumbnail] = useState(null);
  const [errorThumbnail, setErrorThumbnail] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const statusUser = useSelector((state) => state.users.status);
  const errorUser = useSelector((state) => state.users.error);

  const dataUser = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  const status = useSelector((state) => state.blogs.statusUpdate);
  const blog = useSelector((state) => state.blogs.blog);
  const error = useSelector((state) => state.blogs.error);
  const statusGetBlog = useSelector((state) => state.blogs.status);

  useEffect(() => {
    if (statusUser === 'idle') {
      dispatch(fetchAllUsers());
    } else if (statusUser === 'failed') {
      console.error(errorUser);
    } else if (statusUser === 'successful') {
      setUsers(dataUser.users);
    }
  }, [statusUser, dispatch, errorUser, dataUser]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
      title: blog?.title || '',
      authID: blog?.authID  ||'',
      authName: blog?.authName || '',
      content: blog?.content || '',
      slug: blog?.slug || '',
      tags: blog?.tags || [],
      status: blog?.status || 'public',
      metaDescription: blog?.metaDescription || '',
      metaKeywords: blog?.metaKeywords || '',
    },
    enableReinitialize: true,

    validationSchema: blogSchema,
    onSubmit: (values) => {
      if (thumbnail !== null) {
        values.thumbnail = thumbnail;
      }
      if (status === "" || status === null) {
        handleToast('error', 'Vui lòng chọn trạng thái')
      }
    
      values.tags = tags;
      console.log(values);

      dispatch(updateBlog({ id , data: values }));
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
      {statusGetBlog === 'loading' && <LoadingFull />}

      <SpeedDial
        ariaLabel="Lưu bài viết"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Chỉnh sửa bài viết</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchBlogById({ id }))}
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
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  <Tab label="Trạng thái và người dùng" {...a11yProps(0)} />
                  <Tab label="SEO" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
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
                    <FormControl fullWidth>
                      <InputLabel id="author-select-label">Tác giả</InputLabel>
                      <Select
                        labelId="author-select-label"
                        id="author-select"
                        value={formik.values.authID}
                        label="Tác giả"
                        name="authID"
                        onChange={(e) => {
                          const selectedUser = users.find((user) => user._id === e.target.value);
                          formik.setFieldValue('authID', e.target.value);
                          formik.setFieldValue('authName', selectedUser ? selectedUser.name : '');
                        }
                        }
                        error={formik.touched.authID && Boolean(formik.errors.authID)}
                      >
                        {users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText
                        sx={{
                          color: formik.touched.authID && formik.errors.authID ? 'red' : 'inherit',
                        }}
                      >
                        {formik.touched.authID && formik.errors.authID ? formik.errors.authID : ''}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </TabPanel>
                <TabPanel value={value} index={1}>
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
                </TabPanel>
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
                    initialValue={blog?.content}
                    onChange={(content) => formik.setFieldValue('content', content)}
                    height={200}
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                    {formik.touched.content && formik.errors.content ? formik.errors.content : ''}
                  </FormHelperText>
                </Stack>
                <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
                    <Button type="submit" variant="contained" color="inherit">
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
                   defaultImg={`${backendUrl}${blog?.thumbnail}`}
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
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      sx={{ p: 3, width: '100%' }}
    >
      {value === index && children}
    </Box>
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
