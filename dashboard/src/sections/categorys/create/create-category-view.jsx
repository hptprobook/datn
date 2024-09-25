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
import { createCategory, fetchAllCategories } from 'src/redux/slices/categorySlices';
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

    </Container>
  );
};

export default CreateCategoryView;
