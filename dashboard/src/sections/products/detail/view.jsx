/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Card,
  Chip,
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
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
import { Field, FastField, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { slugify } from 'src/utils/format-text';
import { lazy, useMemo, useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from 'src/redux/slices/categorySlices';
import { fetchAll } from 'src/redux/slices/brandSlices';
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

const TinyEditor = lazy(() => import('src/components/editor/tinyEditor'));
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
  titleSeo: Yup.string()
    .trim()
    .min(1, 'Tiêu đề phải có ít nhất 1 ký tự')
    .max(70, 'Tiêu đề tối đa 70 ký tự')
    .required('Tiêu đề là bắt buộc'),

  descriptionSeo: Yup.string()
    .trim()
    .min(1, 'Mô tả phải có ít nhất 1 ký tự')
    .max(320, 'Mô tả tối đa 320 ký tự')
    .required('Mô tả là bắt buộc'),

  aliasSeo: Yup.string()
    .trim()
    .min(1, 'Đường dẫn phải có ít nhất 1 ký tự')
    .required('Đường dẫn là bắt buộc'),
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
  const [wareHouse, setWareHouse] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const dispatch = useDispatch();
  const [variants, setVariants] = useState([]);

  const status = useSelector((state) => state.products.statusUpdate);
  const error = useSelector((state) => state.products.error);
  const product = useSelector((state) => state.products.product);
  const statusGet = useSelector((state) => state.products.statusGet);

  useEffect(() => {
    // Gọi tất cả các API đồng thời
    const fetchData = async () => {
      try {
        const [categoriesRes, wareHouseRes, brandsRes, variantsRes] = await Promise.all([
          dispatch(fetchAllCategories()),
          dispatch(fetchAllWareHouse()),
          dispatch(fetchAll()),
          dispatch(fetchAllVariants()),
        ]);

        const c = categoriesRes.payload || [];
        setCategories(c);

        const rootCategories = c
          .filter((category) => category.parentId === 'ROOT')
          .map((category) => category.name);

        if (JSON.stringify(rootCategories) !== JSON.stringify(dataTags)) {
          setDataTags(rootCategories);
        }

        setWareHouse(wareHouseRes.payload || []);

        setBrands(brandsRes.payload || []);

        const v = variantsRes.payload || [];
        setColors(v.filter((variant) => variant.type === 'color'));
        setSizes(v.filter((variant) => variant.type === 'size'));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setVariants(product.variants);
    }
  }, [statusGet, product, error]);
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };


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
      variants: product?.variants || [],
      titleSeo: product?.seoOption?.title || '',
      descriptionSeo: product?.seoOption?.description || '',
      aliasSeo: product?.seoOption?.alias || '',
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
      
      values.seoOption = JSON.stringify({
        title: values.titleSeo,
        description: values.descriptionSeo,
        alias: values.aliasSeo,
      });
      values.tags = tags;
      delete values.titleSeo;
      delete values.descriptionSeo;
      delete values.aliasSeo;
      dispatch(updateProduct({ id, data: values }));
    },
  });
  const handleCreateSlug = () => {
    const slug = slugify(formik.values.name);
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
  const categoryOptions = useMemo(
    () => categories.map((item) => ({ value: item._id, label: item.name })),
    [categories]
  );
  const brandsOptions = useMemo(
    () => brands.map((item) => ({ value: item._id, label: item.name })),
    [brands]
  );

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
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 xs={8}>
                <Stack spacing={3}>
                  {/* Thông tin cơ bản */}
                  <Card sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Thông tin cơ bản
                    </Typography>
                    <Grid2 container spacing={3}>
                      <Grid2 xs={12}>
                        <FastField name="name">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tên sản phẩm"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={2}>
                        <Button
                          onClick={handleCreateSlug}
                          variant="contained"
                          color="inherit"
                          disabled={formik.errors.name}
                        >
                          Tạo slug
                        </Button>
                      </Grid2>
                      <Grid2 xs={10}>
                        <FastField name="slug">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Slug"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={4}>
                        <FastField name="price">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Giá"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={4}>
                        <FastField name="statusStock">
                          {({ field, form, meta }) => (
                            <FormControl
                              fullWidth
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                            >
                              <InputLabel id="statusStock-label">Tình trạng</InputLabel>
                              <Select
                                {...field}
                                labelId="statusStock-label"
                                id="statusStock-select"
                                label="Tình trạng"
                              >
                                <MenuItem value="stock">Còn hàng</MenuItem>
                                <MenuItem value="outStock">Hết hàng</MenuItem>
                                <MenuItem value="preOrder">Đặt trước</MenuItem>
                              </Select>
                              {meta.touched && meta.error && (
                                <FormHelperText>{meta.error}</FormHelperText>
                              )}
                            </FormControl>
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={4}>
                        <FastField name="status">
                          {({ field, form, meta }) => (
                            <FormControl component="fieldset" variant="standard">
                              <FormLabel component="legend">Trạng thái</FormLabel>
                              <FormControlLabel
                                control={
                                  <Switch
                                    {...field}
                                    onChange={(event) => {
                                      form.setFieldValue(field.name, event.target.checked);
                                    }}
                                    checked={field.value}
                                  />
                                }
                                label={field.value ? 'Hiện' : 'Ẩn'}
                              />
                              {meta.touched && meta.error && (
                                <FormHelperText error>{meta.error}</FormHelperText>
                              )}
                            </FormControl>
                          )}
                        </FastField>
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
                      defaultVariants={product?.variants || variants}
                      colors={colors}
                      sizes={sizes}
                      dataWareHouse={wareHouse}
                    />
                  </Card>

                  {/* Mô tả sản phẩm */}
                  <Card sx={{ padding: 3 }}>
                    <Stack spacing={3}>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Mô tả sản phẩm
                      </Typography>
                      <Field name="description">
                        {({ field, meta }) => (
                          <>
                            <TinyEditor
                              {...field}
                              error={meta.touched && Boolean(meta.error)}
                              initialValue={formik.values.description}
                              onChange={(text) => formik.setFieldValue('description', text)}
                            />
                            <FormHelperText sx={{ color: 'red' }}>
                              {meta.touched && meta.error}
                            </FormHelperText>
                          </>
                        )}
                      </Field>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Mô tả ngắn sản phẩm
                      </Typography>
                      <Field name="content">
                        {({ field, meta }) => (
                          <>
                            <TinyEditor
                              {...field}
                              error={meta.touched && Boolean(meta.error)}
                              initialValue={formik.values.content}
                              height={200}
                              onChange={(content) => formik.setFieldValue('content', content)}
                            />
                            <FormHelperText sx={{ color: 'red' }}>
                              {meta.touched && meta.error}
                            </FormHelperText>
                          </>
                        )}
                      </Field>
                    </Stack>
                  </Card>
                  <Card sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Thông tin khác
                    </Typography>
                    <Grid2 container spacing={3}>
                      <Grid2 xs={4}>
                        <FastField name="inventory">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Số lượng trong kho"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>

                      <Grid2 xs={4}>
                        <FastField name="minInventory">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tối thiểu"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>

                      <Grid2 xs={4}>
                        <FastField name="maxInventory">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tối đa"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={6}>
                        <FastField name="weight">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Cân nặng (kg)"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={6}>
                        <FastField name="height">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Chiều cao (cm)"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={12}>
                        <FastField name="titleSeo">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tiêu đề seo"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={12}>
                        <FastField name="aliasSeo">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Đường dẫn seo"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={12}>
                        <FastField name="descriptionSeo">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Mô tả seo"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </FastField>
                      </Grid2>
                      <Grid2 xs={12}>
                        <Button type="submit" variant="contained" color="inherit">
                          Tạo sản phẩm
                        </Button>
                      </Grid2>
                    </Grid2>
                  </Card>
                </Stack>
              </Grid2>

              {/* Phần phụ */}
              <Grid2 xs={4}>
                <Card sx={{ padding: 3 }}>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Hình ảnh đại diện sản phẩm
                    </Typography>
                    <ImageDropZone
                      error={errorThumbnail}
                      defaultImg={product?.thumbnail}
                      singleFile
                      handleUpload={handleChangeUploadThumbnail}
                    />
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Hình ảnh sản phẩm
                    </Typography>
                    <MultiImageDropZone error={errorImgs}  defaultImgs={product?.images} handleUpload={handleChangeUploadImgs} />
                    <FastField name="cat_id">
                      {({ field, form, meta }) => (
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={meta.touched && Boolean(meta.error)}
                        >
                          <InputLabel id="category-label">Danh mục</InputLabel>
                          <Select
                            {...field}
                            labelId="category-label"
                            id="category-select"
                            label="Danh mục"
                          >
                            {categoryOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {meta.touched && meta.error && (
                            <FormHelperText>{meta.error}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="brand">
                      {({ field, form, meta }) => (
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={meta.touched && Boolean(meta.error)}
                        >
                          <InputLabel id="brand-label">Nhãn hàng</InputLabel>
                          <Select
                            {...field}
                            labelId="brand-label"
                            id="brand-select"
                            label="Nhãn hàng"
                          >
                            {brandsOptions.map((b) => (
                              <MenuItem key={b.value} value={b.value}>
                                {b.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {meta.touched && meta.error && (
                            <FormHelperText>{meta.error}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </FastField>
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
        </FormikProvider>
      )}
    </Container>
  );
}
