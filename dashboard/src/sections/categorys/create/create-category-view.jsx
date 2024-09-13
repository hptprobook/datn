import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  InputLabel,
  TextField,
  Grid,
  MenuItem,
  FormHelperText,
  FormControl,
} from '@mui/material';
import EditorContent from 'src/components/editor/editor';
import InfoBox from 'src/components/Box/InforBox';
import ImageDropZone from 'src/components/DropZoneUpload/DropZoneImage';
import "./styles.css";
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, fetchAllCategories } from 'src/redux/slices/categoriesSlice';
import { handleToast } from 'src/hooks/toast';
import Select from '@mui/material/Select';

const validationSchema = Yup.object({
  categoryName: Yup.string().required('Tên Danh mục là bắt buộc'),
  description: Yup.string().required('Mô tả là bắt buộc'),
  parentCategory: Yup.string().nullable(), // Optional field for parent category
});

const CreateCategoryView = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.data);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const [dataCategories, setDataCategories] = useState([]);
  const [ParentCategory, setParentCategory] = React.useState('');

  const handleChangeParentCategory = (event) => {
    setParentCategory(event.target.value);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCategories());
    } else if (status === 'failed') {
      console.error(error);
    } else if (status === 'succeeded') {
      setDataCategories(categories);
    }
  }, [status, dispatch, error, categories]);

  const handleChangeUploadImg = (files) => {
    // Handle image upload
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một Danh mục mới</Typography>
      </Stack>
      <Box justifyContent="center">
        <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
          <Typography variant="h6" gutterBottom>Chi tiết</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>Tiêu đề, mô tả, hình ảnh...</Typography>
          <Formik
            initialValues={{ categoryName: '', description: '', parentCategory: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const data = {
                name: values.categoryName,
                description: values.description,
                slug: values.categoryName.toLowerCase().replace(/ /g, '-'),
                parentId: values.parentCategory || null || "null",
              };
              try {
                console.log(data);
                await dispatch(createCategory({ data })).unwrap();
                handleToast('success', 'Danh mục đã được tạo thành công!');
              } catch (error) {
                handleToast('error', 'Có lỗi xảy ra khi tạo danh mục.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ pb: 4 }}>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="categoryName">Tên Danh mục</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="categoryName"
                      name="categoryName"
                      label="Tên Danh mục"
                      variant="outlined"
                      placeholder="Tên danh mục"
                      helperText={<ErrorMessage name="categoryName" component="div" className="error-message" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="description">Mô tả</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <Field name="description">
                      {({ field, form }) => (
                        <EditorContent
                          {...field}
                          value={field.value}
                          onChange={(content) => {
                            form.setFieldValue(field.name, content);
                          }}
                        />
                      )}
                    </Field>
                    <FormHelperText>
                      <ErrorMessage name="description" component="div" className="error-message" />
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="parentCategory">Danh mục cha</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="parentCategory">Danh mục cha</InputLabel>
                      <Select
                        labelId="parentCategory-label"
                        id="parentCategory"
                        value={ParentCategory}
                        onChange={handleChangeParentCategory}
                        label="Danh mục cha"
                      >
                        <MenuItem value="">
                          <em>Chọn danh mục cha</em>
                        </MenuItem>
                        {dataCategories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <ErrorMessage name="parentCategory" component="div" className="error-message" />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoBox title="Hình ảnh">
                    <ImageDropZone handleUpload={handleChangeUploadImg} singleFile />
                    </InfoBox>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: '#1C252E', color: 'foreground-foreground', py: 2, px: 4, borderRadius: '8px', '&:hover': { backgroundColor: '#1C252E', opacity: 0.8 } }}>
                      Tạo Danh mục
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateCategoryView;