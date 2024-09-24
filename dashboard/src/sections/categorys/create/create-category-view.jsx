/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react';
import { Form, Field, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Box,
  Grid,
  Button,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import EditorContent from 'src/components/editor/editor';
import InfoBox from 'src/components/Box/InforBox';
import ImageDropZone from 'src/components/DropZoneUpload/DropZoneImage';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, fetchAllCategories } from 'src/redux/slices/categoriesSlice';
import { handleToast } from 'src/hooks/toast';
import Select from '@mui/material/Select';

const validationSchema = Yup.object({
  name: Yup.string().required('Tên Danh mục là bắt buộc'),
  description: Yup.string().required('Mô tả là bắt buộc'),
  parentId: Yup.string().nullable(), // Optional field for parent category
  content: Yup.string().required('Nội dung là bắt buộc'), // Add validation for content
  status: Yup.string().required('Trạng thái là bắt buộc'), // Add validation for status
});

const flattenCategories = (categories, parentId = 'ROOT', level = 0) => {
  const flatCategories = [];

  categories.forEach((category) => {
    if (category.parentId === parentId) {
      flatCategories.push({ ...category, level });
      flatCategories.push(...flattenCategories(categories, category._id, level + 1));
    }
  });

  return flatCategories;
};

const CreateCategoryView = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.data);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const [dataCategories, setDataCategories] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  console.log(categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCategories());
    } else if (status === 'failed') {
      console.error(error);
    } else if (status === 'succeeded') {
      const flatCategories = flattenCategories(categories);
      setDataCategories(flatCategories);
      console.log(flatCategories);
    }
  }, [status, dispatch, error, categories]);

  const handleChangeUploadImg = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedImageUrl(file);
    }
  };

  // Filter categories to include only those with parentId as ROOT and their direct children
  const filteredCategories = dataCategories.filter(
    (category) =>
      category.parentId === 'ROOT' ||
      categories.some((cat) => cat._id === category.parentId && cat.parentId === 'ROOT')
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo một Danh mục mới</Typography>
      </Stack>
      <Box justifyContent="center">
        <Box
          sx={{
            maxWidth: 'lg',
            p: 6,
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRadius: 2,
            boxShadow: 3,
            mt: 5,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chi tiết
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tiêu đề, mô tả, hình ảnh...
          </Typography>
          <Formik
            initialValues={{
              name: '',
              description: '',
              parentId: '',
              content: '',
              status: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
          
              console.log(values);
              const file = {
                file: uploadedImageUrl,
                name: 'image',
              };

              try {
                await dispatch(createCategory({ data: values , image: file })).unwrap();
                handleToast('success', 'Danh mục đã được tạo thành công!');
              } catch (err) {
                handleToast('error', 'Có lỗi xảy ra khi tạo danh mục.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, setFieldValue, values }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ pb: 4 }}>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="name">Tên Danh mục</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="name"
                      name="name"
                      label="Tên Danh mục"
                      variant="outlined"
                      placeholder="Tên danh mục"
                      helperText={
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="error-message"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="description">Mô tả</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    {/* <Field name="description">
                      {({ field, form }) => (
                        // <EditorContent
                        //   {...field}
                        //   value={field.value}
                        //   onChange={(content) => {
                        //     form.setFieldValue(field.name, content);
                        //   }}
                        // />
                      )}
                    </Field> */}
                    <FormHelperText>
                      <ErrorMessage name="description" component="div" className="error-message" />
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="parentId">Danh mục cha</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="parentId">Danh mục cha</InputLabel>
                      <Field name="parentId">
                        {({ field }) => (
                          <Select
                            {...field}
                            labelId="parentId-label"
                            id="parentId"
                            value={values.parentId}
                            onChange={(event) =>
                              setFieldValue('parentId', event.target.value)
                            }
                            label="Danh mục cha"
                          >
                            <MenuItem value="">
                              <em>Chọn danh mục cha</em>
                            </MenuItem>
                            {filteredCategories.length > 0 &&
                              filteredCategories.map((category) => (
                                <MenuItem
                                  key={category._id}
                                  value={category._id}
                                  style={{
                                    paddingLeft: `${(category.level + 1) * 20}px`, // Ensure ROOT has the same padding as its children
                                    fontWeight: category.parentId === 'ROOT' ? 'bold' : 'normal',
                                    color: category.parentId === 'ROOT' ? 'black' : 'inherit',
                                  }}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      </Field>
                      <FormHelperText>
                        <ErrorMessage
                          name="parentId"
                          component="div"
                          className="error-message"
                        />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="content">Nội dung</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="content"
                      name="content"
                      label="Nội dung"
                      variant="outlined"
                      placeholder="Nội dung"
                      helperText={
                        <ErrorMessage name="content" component="div" className="error-message" />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <InputLabel htmlFor="status">Trạng thái</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="status">Trạng thái</InputLabel>
                      <Field name="status">
                        {({ field }) => (
                          <Select
                            {...field}
                            labelId="status-label"
                            id="status"
                            value={values.status}
                            onChange={(event) => setFieldValue('status', event.target.value)}
                            label="Trạng thái"
                          >
                      <MenuItem value={true}>Hoạt động</MenuItem>
                      <MenuItem value={false}>Không hoạt động</MenuItem>
                          </Select>
                        )}
                      </Field>
                      <FormHelperText>
                        <ErrorMessage name="status" component="div" className="error-message" />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoBox title="Hình ảnh">
                      <ImageDropZone handleUpload={handleChangeUploadImg} singleFile />
                    </InfoBox>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: '#1C252E',
                        color: 'foreground-foreground',
                        py: 2,
                        px: 4,
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#1C252E', opacity: 0.8 },
                      }}
                    >
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
