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
  IconButton,
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
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from 'src/redux/slices/categorySlices';
import { fetchAll } from 'src/redux/slices/brandSlices';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import { setStatus, updateProduct, fetchProductById } from 'src/redux/slices/productSlice';
import LoadingFull from 'src/components/loading/loading-full';
import { useParams } from 'react-router-dom';
import { isValidObjectId } from 'src/utils/check';
import { useRouter } from 'src/routes/hooks';
import MultiImageDropZone from 'src/components/drop-zone-upload/upload-imgs';
import { fetchAllVariants } from 'src/redux/slices/variantSlices';
import { fetchAll as fetchAllWareHouse } from 'src/redux/slices/warehouseSlices';

import { AutoSelect } from '../auto-select';
import AdvancedVariant from '../variant-advanced';

// ----------------------------------------------------------------------
const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên sản phẩm là bắt buộc')
    .min(5, 'Tên sản phẩm phải ít nhất 5 ký tự')
    .max(255, 'Tên sản phẩm không được quá 255 ký tự'),
  slug: Yup.string().min(5, 'Slug phải ít nhất 5 ký tự').max(255, 'Slug không được quá 255 ký tự'),
  cat_id: Yup.string().required('Danh mục là bắt buộc'),
  brand: Yup.string().required('Nhãn hàng là bắt buộc'),
  productType: Yup.array()
    .required('Loại sản phẩm là bắt buộc')
    .min(1, 'Loại sản phẩm là bắt buộc'),
  description: Yup.string()
    .required('Mô tả ngắn là bắt buộc')
    .min(5, 'Mô tả ngắn phải ít nhất 5 ký tự')
    .max(1000, 'Mô tả ngắn không được quá 10000 ký tự'),
  content: Yup.string()
    .required('Mô tả là bắt buộc')
    .min(5, 'Mô tả phải ít nhất 5 ký tự')
    .max(10000, 'Mô tả không được quá 1000 ký tự'),
  price: Yup.string()
    .required('Cần nhập có giá thông thường')
    .min(1, 'Giá cơ bản phải lớn hơn 1')
    .typeError('Giá không hợp lệ'),
  seoOption: Yup.object().shape({
    title: Yup.string()
      .trim()
      .min(1, 'Tiêu đề phải có ít nhất 1 ký tự')
      .max(70, 'Tiêu đề tối đa 70 ký tự')
      .required('Tiêu đề là bắt buộc'),
    description: Yup.string()
      .trim()
      .min(1, 'Mô tả phải có ít nhất 1 ký tự')
      .max(320, 'Mô tả tối đa 320 ký tự')
      .required('Mô tả là bắt buộc'),

    alias: Yup.string()
      .trim()
      .min(1, 'Đường dẫn phải có ít nhất 1 ký tự')
      .required('Đường dẫn là bắt buộc'),
  }),
});

export default function DetailProductPage() {
  const { id } = useParams();
  const route = useRouter();
  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(fetchProductById({ id }));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/products');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [logError, setLogError] = useState('');
  const [errorThumbnail, setErrorThumbnail] = useState(null);
  const [errorImgs, setErrorImgs] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(0);
  const [wareHouse, setWareHouse] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const dispatch = useDispatch();
  const [variants, setVariants] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const status = useSelector((state) => state.products.statusUpdate);
  const error = useSelector((state) => state.products.error);
  const product = useSelector((state) => state.products.product);
  const statusGet = useSelector((state) => state.products.statusGet);

  useEffect(() => {
    dispatch(fetchAllCategories()).then((res) => {
      setCategories(res.payload);
    });
    dispatch(fetchAll()).then((res) => {
      setBrands(res.payload);
    });
    dispatch(fetchAllWareHouse()).then((res) => {
      setWareHouse(res.payload);
    });
    dispatch(fetchAllVariants()).then((res) => {
      if (res.payload) {
        const a = res.payload.filter((item) => item.type === 'color');
        const b = res.payload.filter((item) => item.type === 'size');
        setColors(a);
        setSizes(b);
      }
    });
  }, [dispatch]);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };
  useEffect(() => {
    if (statusGet === 'failed') {
      handleToast('error', error.message);
    }
    if (statusGet === 'successful') {
      setVariants(product?.variants);
    }
  }, [statusGet, product, error]);
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      description: product?.description || '',
      brand: product?.brand || '',
      cat_id: product?.cat_id || '',
      content: product?.content || '',
      slug: product?.slug || '',
      productType: product?.productType || [],
      price: product?.price || '',
      statusStock: product?.statusStock || 'stock',
      tags: product?.tags || [],
      status: product?.status || true,
      height: product?.height || 1,
      weight: product?.weight || 1,
      variants: [],
      seoOption:
        {
          title: '',
          description: '',
          alias: '',
        } || product?.seoOption,
    },
    enableReinitialize: true,
    validationSchema: productSchema,
    onSubmit: (values) => {
      if (logError !== '') {
        handleToast('error', logError);
        return;
      }
      if (thumbnail !== null) {
        values.thumbnail = thumbnail;
      }
      if (variants.length === 0) {
        handleToast('error', 'Vui lòng thêm biến thể sản phẩm');
        return;
      }
      if (images.length > 0) {
        const imageAdd = images.filter((img) => img instanceof File);
        const imagesDelete = product.images.filter((img) => !images.includes(img));
        if (imagesDelete.length > 0) {
          values.imagesDelete = imagesDelete;
        }
        if (imageAdd.length > 0) {
          values.images = imageAdd;
        }
      }
      values.tags = tags;
      const newVariants = variants.map((variant) => ({
        ...variant,
        sku: variant.sku.toString(),
      }));
      newVariants.forEach((variant) => {
        if (variant.image instanceof File) {
          const m = variant.imageAdd;
          variant.imageAdd = variant.image;
          variant.image = m;
        }
      });
      values.variants = newVariants;
      // xử lý ảnh biến thể
      const variantsDelete = product.variants.filter((variant) => {
        const check = variants.find((v) => v.sku === variant.sku);
        if (!check) {
          return variant;
        }
        return null;
      });
      if (variantsDelete.length > 0) {
        values.variantsDelete = variantsDelete;
      }
      console.log(values);
      dispatch(updateProduct({ id, data: values }));
    },
  });

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
      setErrorThumbnail('');
      setThumbnail(files);
    } else {
      setThumbnail(null);
    }
  }, []);
  const handleChangeUploadImgs = useCallback((files) => {
    if (files) {
      setErrorImgs('');
      setImages(files);
    } else {
      setImages(null);
    }
  }, []);
  const handleCreateVariant = (values) => {
    if (values.length > 0) {
      setVariants(values);
      setLogError('');
    } else {
      setLogError('Vui lòng thêm biến thể sản phẩm');
      handleToast('error', 'Vui lòng thêm biến thể sản phẩm');
    }
  };
  useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Cập nhật sản phẩm thành công');
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
      {statusGet === 'loading' && <LoadingFull />}

      <SpeedDial
        ariaLabel="Lưu sản phẩm"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => formik.handleSubmit()}
        icon={<Iconify icon="eva:save-fill" />}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Chỉnh sửa sản phẩm</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchProductById({ id }))}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
      </Stack>
      {statusGet === 'loading' ? (
        <LoadingFull />
      ) : (
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
                        error={formik.touched.slug && Boolean(formik.errors.slug)}
                        helperText={formik.touched.slug && formik.errors.slug}
                      />
                    </Grid2>
                  </Grid2>
                </Card>

                <Card
                  sx={{
                    padding: 3,
                  }}
                >
                  <AdvancedVariant
                    onUpdate={handleCreateVariant}
                    defaultVariants={variants}
                    colors={colors}
                    sizes={sizes}
                    dataWareHouse={wareHouse}
                  />
                </Card>
                <Card
                  sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', padding: 3 }}
                >
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                  >
                    <Tab label="Giá" {...a11yProps(0)} />
                    <Tab label="Kích thước" {...a11yProps(1)} />
                    <Tab label="SEO" {...a11yProps(2)} />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <Stack spacing={3} sx={{ width: '100%' }}>
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-money">Giá</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-money"
                          type="text"
                          name="price"
                          value={formik.values.price}
                          onChange={formik.handleChange}
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
                    <Stack spacing={3}>
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-height">Chiều dài</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-height"
                          type="text"
                          name="height"
                          value={formik.values.height}
                          onChange={formik.handleChange}
                          endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                          label="Chiều dài"
                        />
                        <FormHelperText>
                          {formik.touched.height && formik.errors.height
                            ? formik.errors.height
                            : ''}
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
                          endAdornment={<InputAdornment position="end">g</InputAdornment>}
                          label="Cân nặng"
                        />
                        <FormHelperText>
                          {formik.touched.weight && formik.errors.weight
                            ? formik.errors.weight
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Tiêu đề"
                        variant="outlined"
                        name="seoOption.title"
                        value={formik.values.seoOption?.title}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.seoOption?.title && Boolean(formik.errors.seoOption?.title)
                        }
                        helperText={
                          formik.touched.seoOption?.title && formik.errors.seoOption?.title
                        }
                      />
                      <TextField
                        fullWidth
                        label="Mô tả"
                        variant="outlined"
                        name="seoOption.description"
                        value={formik.values.seoOption.description}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.seoOption?.description &&
                          Boolean(formik.errors.seoOption?.description)
                        }
                        helperText={
                          formik.touched.seoOption?.description &&
                          formik.errors.seoOption?.description
                        }
                      />
                      <TextField
                        fullWidth
                        label="Đường dẫn"
                        variant="outlined"
                        name="seoOption.alias"
                        value={formik.values.seoOption.alias}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.seoOption?.alias && Boolean(formik.errors.seoOption?.alias)
                        }
                        helperText={
                          formik.touched.seoOption?.alias && formik.errors.seoOption?.alias
                        }
                      />
                    </Stack>
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
                    {/* <TinyEditor
                      error={formik.touched.content && Boolean(formik.errors.content)}
                      initialValue={product?.content}
                      onChange={(text) => formik.setFieldValue('content', text)}
                    /> */}
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.content && formik.errors.content ? formik.errors.content : ''}
                    </FormHelperText>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Mô tả ngắn sản phẩm
                    </Typography>
                    {/* <TinyEditor
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      initialValue={product?.description}
                      onChange={(description) => formik.setFieldValue('description', description)}
                      height={200}
                    /> */}
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.description && formik.errors.description
                        ? formik.errors.description
                        : ''}
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
                    Hình ảnh đại diện sản phẩm
                  </Typography>
                  <ImageDropZone
                    error={errorThumbnail}
                    singleFile
                    defaultImg={product?.thumbnail}
                    handleUpload={handleChangeUploadThumbnail}
                  />
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Hình ảnh sản phẩm
                  </Typography>
                  <MultiImageDropZone
                    defaultImgs={product?.images}
                    error={errorImgs}
                    handleUpload={handleChangeUploadImgs}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="category-select-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={formik.values.cat_id}
                      label="Danh mục"
                      name="cat_id"
                      onChange={formik.handleChange}
                      error={formik.touched.cat_id && Boolean(formik.errors.cat_id)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      sx={{
                        color: formik.touched.cat_id && formik.errors.cat_id ? 'red' : 'inherit',
                      }}
                    >
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
                      error={formik.touched.brand && Boolean(formik.errors.brand)}
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.brand && formik.errors.brand ? formik.errors.brand : ''}
                    </FormHelperText>
                  </FormControl>
                  <AutoSelect
                    value={formik.values.productType}
                    setValue={(select) => formik.setFieldValue('productType', select)}
                    data={dataTags}
                    label="Loại sản phẩm"
                    error={formik.touched.productType && Boolean(formik.errors.productType)}
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                    {formik.touched.productType && formik.errors.productType
                      ? formik.errors.productType
                      : ''}
                  </FormHelperText>
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
      )}
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
