/* eslint-disable react/prop-types */
import { Field, FastField, useFormik, FormikProvider } from 'formik';

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
  InputLabel,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
import * as Yup from 'yup';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { lazy, useMemo, useState, useEffect, useCallback } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from 'src/redux/slices/categorySlices';
import { fetchAll } from 'src/redux/slices/brandSlices';
import { handleToast } from 'src/hooks/toast';
import { setStatus, createProduct } from 'src/redux/slices/productSlice';
import LoadingFull from 'src/components/loading/loading-full';
import { fetchAllVariants } from 'src/redux/slices/variantSlices';
import { fetchAll as fetchAllWareHouse } from 'src/redux/slices/warehouseSlices';

import MultiImageDropZone from 'src/components/drop-zone-upload/upload-imgs';
import { slugify } from 'src/utils/format-text';
import { AutoSelect } from '../auto-select';
import CreateVariant from '../variant';

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
  inventory: Yup.number().integer('Số lượng tồn kho phải là số nguyên').default(0),

  minInventory: Yup.number().integer('Số lượng tồn kho tối thiểu phải là số nguyên').default(0),

  maxInventory: Yup.number().integer('Số lượng tồn kho tối đa phải là số nguyên').default(0),
  productType: Yup.array()
    .required('Loại sản phẩm là bắt buộc')
    .min(1, 'Loại sản phẩm là bắt buộc'),
  description: Yup.string()
    // .required('Mô tả là bắt buộc')
    .min(5, 'Mô tả phải ít nhất 5 ký tự')
    .max(10000, 'Mô tả không được quá 10000 ký tự'),
  content: Yup.string()
    // .required('Mô tả ngắn là bắt buộc')
    .min(5, 'Mô tả ngắn phải ít nhất 5 ký tự')
    .max(1000, 'Mô tả ngắn không được quá 1000 ký tự'),
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
  price: Yup.string()
    .required('Cần nhập có giá thông thường')
    .min(1, 'Giá cơ bản phải lớn hơn 1')
    .typeError('Giá không hợp lệ'),
});

export default function CreateProductPage() {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [errorThumbnail, setErrorThumbnail] = useState(null);
  const [errorImgs, setErrorImgs] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wareHouse, setWareHouse] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const dispatch = useDispatch();
  const [variants, setVariants] = useState(null);

  const status = useSelector((state) => state.products.statusCreate);
  const error = useSelector((state) => state.products.error);

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
      brand: '',
      cat_id: '',
      content: '',
      slug: '',
      productType: [],
      price: 1,
      statusStock: 'stock',
      tags: [],
      status: true,
      height: 1,
      weight: 1,
      variants: [],
      inventory: 0,
      minInventory: 0,
      maxInventory: 0,
      titleSeo: '',
      descriptionSeo: '',
      aliasSeo: '',
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      if (thumbnail === null) {
        setErrorThumbnail('Vui lòng chọn ảnh đại diện');
        return;
      }
      if (images === null) {
        setErrorImgs('Vui lòng chọn ảnh sản phẩm');
        return;
      }
      if (variants === null) {
        handleToast('error', 'Vui lòng thêm biến thể sản phẩm');
        return;
      }
      values.variants = variants;
      values.thumbnail = thumbnail;
      values.images = images;
      values.seoOption = JSON.stringify({
        title: values.titleSeo,
        description: values.descriptionSeo,
        alias: values.aliasSeo,
      });
      values.tags = tags;
      delete values.titleSeo;
      delete values.descriptionSeo;
      delete values.aliasSeo;
      dispatch(createProduct({ data: values }));
    },
  });
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

  const handleCreateSlug = (e) => {
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
    } else {
      setVariants(null);
    }
  };
  useEffect(() => {
    if (status === 'failed') {
      handleToast('error', error.message);
    }
    if (status === 'successful') {
      handleToast('success', 'Tạo sản phẩm thành công');
      formik.resetForm();
      setTags([]);
      setImages([]);
      setThumbnail(null);
      setVariants(null);
    }
    dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một sản phẩm mới</Typography>
      </Stack>

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
                      <Button onClick={handleCreateSlug} variant="contained" color="inherit" disabled={formik.errors.name}>
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
                  <CreateVariant
                    onUpdate={handleCreateVariant}
                    colorsData={colors}
                    sizesData={sizes}
                    wareHousesData={wareHouse}
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
                            initialValue="Đây là nội dung mô tả của sản phẩm"
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
                            initialValue="Đây là mô tả ngắn của sản phẩm"
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
                    singleFile
                    handleUpload={handleChangeUploadThumbnail}
                  />
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Hình ảnh sản phẩm
                  </Typography>
                  <MultiImageDropZone error={errorImgs} handleUpload={handleChangeUploadImgs} />
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
    </Container>
  );
}
