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
  Switch,
  Button,
  MenuItem,
  TextField,
  FormLabel,
  SpeedDial,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { slugify } from 'src/utils/format-text';
import TinyEditor from 'src/components/editor/tinyEditor';
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch } from 'react-redux';
import { fetchAllCategories } from 'src/redux/slices/categorySlices';
import { fetchAll } from 'src/redux/slices/brandSlices';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { AutoSelect } from '../auto-select';
import CreateVariant from '../variant';

// ----------------------------------------------------------------------
const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên sản phẩm là bắt buộc')
    .min(5, 'Tên sản phẩm phải ít nhất 5 ký tự')
    .max(255, 'Tên sản phẩm không được quá 255 ký tự'),
  slug: Yup.string().min(5, 'Slug phải ít nhất 5 ký tự').max(255, 'Slug không được quá 255 ký tự'),
  description: Yup.string()
    .required('Mô tả là bắt buộc')
    .min(5, 'Mô tả phải ít nhất 5 ký tự')
    .max(10000, 'Mô tả không được quá 10000 ký tự'),
  shortDescription: Yup.string()
    .required('Mô tả ngắn là bắt buộc')
    .min(5, 'Mô tả ngắn phải ít nhất 5 ký tự')
    .max(1000, 'Mô tả ngắn không được quá 1000 ký tự'),
  quantity: Yup.number()
    .required('Số lượng là bắt buộc')
    .min(1, 'Số lượng phải ít nhất là 1')
    .max(1000, 'Số lượng không được quá 1000'),
  stock: Yup.number()
    .required('Stock is required')
    .min(0, 'Stock must be greater than or equal to 0'),
  price: Yup.number().required('Cần nhập có giá thông thường').min(0, 'Giá không được âm'),
  salePrice: Yup.number().min(0, 'Giá khuyến mãi không được âm'),
});

export default function CreateProductPage() {
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState(null);
  const [uploadedImgsUrl, setUploadedImgsUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(0);
  const [brands, setBrands] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const dispatch = useDispatch();
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
      name: '',
      description: '',
      shortDescription: '',
      brand: '',
      cat_id: '',
      content: '',
      slug: '',
      productType: ['Nam'],
      quantity: 0,
      stock: 0,
      price: 0,
      salePrice: 0,
      statusStock: 'stock',
      tags: [],
      status: true,
      height: 0,
      weight: 0,
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      console.log(values);
      console.log(uploadedThumbnailUrl);
      console.log(uploadedImgsUrl);
    },
  });
  useEffect(() => {
    dispatch(fetchAllCategories()).then((res) => {
      setCategories(res.payload);
    });
    dispatch(fetchAll()).then((res) => {
      setBrands(res.payload);
    });
  }, [dispatch]);
  useEffect(() => {
    if (categories.length > 0) {
      const newTags = categories
        .map((category) => {
          if (category.parentId === 'ROOT') {
            return category.name;
          }
          return null;
        })
        .filter((tag) => tag !== null);
      // Only update tags if they are different to avoid triggering re-render
      if (JSON.stringify(newTags) !== JSON.stringify(dataTags)) {
        setDataTags(newTags);
      }
    }
  }, [categories, dataTags]);

  const handleCreateSlug = (e) => {
    formik.setFieldValue('name', e.target.value);
    const slug = slugify(e.target.value);
    formik.setFieldValue('slug', slug);
  };
  const handleChangeUploadThumbnail = useCallback((files) => {
    if (files) {
      setUploadedThumbnailUrl({
        file: files,
        name: 'thumbnail',
      });
    }
  }, []);
  const handleChangeUploadImgs = useCallback((files) => {
    if (files) {
      setUploadedImgsUrl({
        file: files,
        name: 'images',
      });
    }
  }, []);
  const formatNumber = (number) => {
    if (!number) return '';
    // Remove non-numeric characters first to prevent errors
    const numericValue = number.replace(/\D/g, '');
    return new Intl.NumberFormat('vi-VN').format(numericValue);
  };

  return (
    <Container>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một sản phẩm mới</Typography>
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
                      label="Tên sản phẩm"
                      variant="outlined"
                      name="name"
                      value={formik.values.name}
                      onChange={(e) => handleCreateSlug(e)}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
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
                  <Tab label="Giá" {...a11yProps(0)} />
                  <Tab label="Biến thể" {...a11yProps(1)} />
                  <Tab label="Kích thước" {...a11yProps(2)} />
                  <Tab label="SEO" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <Stack spacing={3} sx={{ width: '100%' }}>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-money">Giá</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-money"
                        type="text"
                        name="price"
                        value={formatNumber(formik.values.price)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                        label="Giá"
                      />
                      <FormHelperText>
                        {formik.touched.price && formik.errors.price ? formik.errors.price : ''}
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="statusStock-select-label">Trạng thái sản phẩm</InputLabel>
                      <Select
                        labelId="statusStock-select-label"
                        id="statusStock-select"
                        name="statusStock"
                        value={formik.values.statusStock}
                        label="Trạng thái sản phẩm"
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="stock">Còn hàng</MenuItem>
                        <MenuItem value="outStock">Hết hàng</MenuItem>
                        <MenuItem value="preOrder">Đang nhập hàng</MenuItem>
                      </Select>
                    </FormControl>
                    <Box>
                      <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Trạng thái</FormLabel>
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={formik.handleChange}
                              name="status"
                              value={formik.values.status}
                              checked={formik.values.status}
                            />
                          }
                          label={formik.values.status ? 'Hiện' : 'Ẩn'}
                        />
                      </FormControl>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <CreateVariant />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Stack spacing={3}>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-height">Chiều dài</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-height"
                        type="text"
                        name="height"
                        value={formik.values.height}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                        label="Chiều dài"
                      />
                      <FormHelperText>
                        {formik.touched.height && formik.errors.height ? formik.errors.height : ''}
                      </FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-weight">Cân nặng</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-weight"
                        type="text"
                        name="weight"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        endAdornment={<InputAdornment position="end">g</InputAdornment>}
                        label="Cân nặng"
                      />
                      <FormHelperText>
                        {formik.touched.weight && formik.errors.weight ? formik.errors.weight : ''}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  Đang cập nhật
                </TabPanel>
              </Card>
              <Card
                sx={{
                  padding: 3,
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Mô tả sản phẩm
                  </Typography>
                  <TinyEditor
                    initialValue="Đây là nội dung mô tả của sản phẩm"
                    onChange={(text) => formik.setFieldValue('description', text)}
                  />
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Mô tả ngắn sản phẩm
                  </Typography>
                  <TinyEditor
                    initialValue="Đây là mô tả ngắn của sản phẩm"
                    onChange={(content) => formik.setFieldValue('content', content)}
                    height={200}
                  />
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
                  Hình ảnh đại diện sản phẩm
                </Typography>
                <ImageDropZone singleFile handleUpload={handleChangeUploadThumbnail} />
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Hình ảnh sản phẩm
                </Typography>
                <ImageDropZone singleFile={false} handleUpload={handleChangeUploadImgs} />
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Danh mục</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formik.values.cat_id}
                    label="Danh mục"
                    name="cat_id"
                    onChange={formik.handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.cat_id && formik.errors.cat_id ? formik.errors.cat_id : ''}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Nhãn hàng</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formik.values.brand}
                    label="Nhãn hàng"
                    name="brand"
                    onChange={formik.handleChange}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.brand && formik.errors.brand ? formik.errors.brand : ''}
                  </FormHelperText>
                </FormControl>
                <AutoSelect
                  value={formik.values.productType}
                  setValue={(select) => formik.setFieldValue('productType', select)}
                  data={dataTags}
                  label="Loại sản phẩm"
                />
                <Box>
                  <TextField
                    label="Nhập nhãn sản phẩm"
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
