/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import checkBoxOutlineBlank from '@iconify/icons-ic/baseline-check-box-outline-blank';
import checkBox from '@iconify/icons-ic/baseline-check-box';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { slugify } from 'src/utils/format-text';
import TinyEditor from 'src/components/editor/tinyEditor';
import { useCallback, useEffect, useState } from 'react';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { useDispatch } from 'react-redux';
import { fetchAllCategories } from 'src/redux/slices/categorySlices';
import { fetchAll } from 'src/redux/slices/brandSlices';
import { AutoSelect } from '../auto-select';

// ----------------------------------------------------------------------

const icon = <Icon icon={checkBoxOutlineBlank} />;
const checkedIcon = <Icon icon={checkBox} />;
// Define validation schema
const productSchema = Yup.object({
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
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      shortDescription: '',
      brand: '',
      cat_id: '',
      content: '',
      slug: '',
      quantity: 0,
      stock: 0,
      price: 0,
      salePrice: 0,
      tags: [],
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  useEffect(() => {
    dispatch(fetchAllCategories()).then((res) => {
      setCategories(res.payload);
    });
    dispatch(fetchAll()).then((res) => {
      setBrands(res.payload);
    });
  }, [dispatch, tags]);
  useEffect(() => {
    if (categories.length > 0) {
      const newTags = categories.map((category) => {
        if (category.parentId === 'ROOT') {
          return category.name;
        }
        return null;
      }).filter((tag) => tag !== null);
      // Only update tags if they are different to avoid triggering re-render
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
        setTags(newTags);
      }
    }
  }, [categories, tags]);

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

  return (
    <Container>
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
                      onBlur={(e) => handleCreateSlug(e)}
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
                    onChange={(value) => formik.setFieldValue('description', value)}
                  />
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Mô tả ngắn sản phẩm
                  </Typography>
                  <TinyEditor
                    initialValue="Đây là mô tả ngắn của sản phẩm"
                    onChange={(value) => formik.setFieldValue('content', value)}
                    height={200}
                  />
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
                  value={formik.values.tags}
                  setValue={(value) => formik.setFieldValue('tags', value)}
                  data={tags}
                  label="Loại sản phẩm"
                />
              </Stack>
            </Card>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
