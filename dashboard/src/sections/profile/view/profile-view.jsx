import React, { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Avatar, IconButton } from '@mui/material';

import Grid2 from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import { updateMe, uploadMe, setStatus } from 'src/redux/slices/staffSlices';
import { getMe } from 'src/redux/slices/authSlice';
import Iconify from 'src/components/iconify';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import { renderUrl } from 'src/utils/check';
import { formatDateTime } from 'src/utils/format-time';
import EditableField from '../edit-field';
import { profileSchema } from '../utils';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
export default function ProfileView() {
  const dispatch = useDispatch();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const data = useSelector((state) => state.auth.auth);
  const statusUpdate = useSelector((state) => state.staffs.statusUpdateMe);
  const error = useSelector((state) => state.staffs.error);

  const handleChangeUploadImg = useCallback((files) => {
    if (files) {
      setUploadedImageUrl({
        file: files,
        name: 'avatar',
      });
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      address: data?.address || '',
      phone: data?.phone || '',
      cccd: data?.cccd || '',
      bankAccount: data?.bankAccount || '',
      avatar: data?.avatar || '',
      bankHolder: data?.bankHolder || '',
      bankName: data?.bankName || '',
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: (values) => {
      Object.keys(values).forEach((key) => {
        if (values[key] === '') {
          values[key] = null;
        }
      });
      dispatch(updateMe(values));
    },
  });
  useEffect(() => {
    if (statusUpdate === 'successful' && data) {
      handleToast('success', 'Cập nhật thành công');
      setInputSelect('');
      dispatch(setStatus({ key: 'statusUpdateMe', value: 'idle' }));
    }
    if (statusUpdate === 'failed') {
      handleToast('error', error?.message || 'Cập nhật thất bại');
    }
  }, [statusUpdate, data, error, dispatch]);
  const handleCancel = () => {
    formik.resetForm();
    setInputSelect('');
  };
  const handleUpdate = (name) => {
    if (formik.values[name] === data[name]) {
      handleCancel();
      return;
    }
    if (formik.errors[name]) {
      handleToast('error', formik.errors[name]);
      return;
    }
    const values = {
      [name]: formik.values[name],
    };
    dispatch(updateMe(values));
  };
  const handleUpload = () => {
    if (uploadedImageUrl) {
      dispatch(uploadMe(uploadedImageUrl));
      setUploadedImageUrl(null);
    } else {
      handleToast('error', 'Chưa chọn ảnh');
    }
  };
  const [inputSelect, setInputSelect] = useState('');
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" mb={5} spacing={1}>
          <Typography variant="h4">Tài khoản</Typography>
          <IconButton onClick={() => dispatch(getMe())}>
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 xs={12} md={4}>
            <Card sx={{ padding: 3 }}>
              {data?.avatar ? (
                <Avatar
                  alt="Ảnh đại diện"
                  src={renderUrl(data?.avatar, backendUrl)}
                  sx={{ width: 100, height: 100, margin: 'auto' }}
                />
              ) : (
                <>
                  <ImageDropZone
                    handleUpload={handleChangeUploadImg}
                    singleFile
                    defaultImg={data?.avatar || ''} // Ensure defaultImg is a valid string
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    mt={2}
                    spacing={2}
                  >
                    <Button variant="contained" color="inherit" onClick={handleUpload}>
                      Lưu
                    </Button>
                  </Stack>
                </>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Tên: {data?.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Email: {data?.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Mã nhân viên: {data?.staffCode}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Ngày tạo: {formatDateTime(data?.createdAt)}
              </Typography>
            </Card>
          </Grid2>
          <Grid2 xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ padding: 3 }}>
                <Stack
                  sx={{
                    display: inputSelect === 'all' ? 'none' : 'flex',
                  }}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={2}
                  spacing={2}
                >
                  <Button variant="contained" color="inherit" onClick={() => setInputSelect('all')}>
                    Chỉnh sửa
                  </Button>
                </Stack>
                <Stack
                  sx={{
                    display: inputSelect === 'all' ? 'flex' : 'none',
                  }}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={2}
                  spacing={2}
                >
                  <Button variant="outlined" color="inherit" onClick={() => setInputSelect('')}>
                    Hủy
                  </Button>
                  <Button variant="contained" color="inherit" type="submit">
                    Lưu
                  </Button>
                </Stack>
                <Grid2 container spacing={3}>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="name"
                      label="Tên"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="address"
                      label="Địa chỉ"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="phone"
                      label="Số điện thoại"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="cccd"
                      label="CCCD"
                      value={formik.values.cccd}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cccd && Boolean(formik.errors.cccd)}
                      helperText={formik.touched.cccd && formik.errors.cccd}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="bankAccount"
                      label="Tài khoản ngân hàng"
                      value={formik.values.bankAccount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.bankAccount && Boolean(formik.errors.bankAccount)}
                      helperText={formik.touched.bankAccount && formik.errors.bankAccount}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="bankHolder"
                      label="Chủ tài khoản"
                      value={formik.values.bankHolder}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.bankHolder && Boolean(formik.errors.bankHolder)}
                      helperText={formik.touched.bankHolder && formik.errors.bankHolder}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <EditableField
                      name="bankName"
                      label="Tên ngân hàng"
                      value={formik.values.bankName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                      helperText={formik.touched.bankName && formik.errors.bankName}
                      inputSelect={inputSelect}
                      setInputSelect={setInputSelect}
                      handleUpdate={handleUpdate}
                      handleCancel={handleCancel}
                    />
                  </Grid2>
                </Grid2>
              </Card>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
