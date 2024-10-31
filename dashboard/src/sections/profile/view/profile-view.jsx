import React, { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';



import { Avatar } from '@mui/material';

import Grid2 from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { handleToast } from 'src/hooks/toast';
import { setStatus } from 'src/redux/slices/userSlice';
import { updateStaffById } from 'src/redux/slices/staffSlices';
import EditableField from '../edit-field';

// ----------------------------------------------------------------------

export default function ProfileView() {
  
  // const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  // const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const data = useSelector((state) => state.auth.auth);
  const status = useSelector((state) => state.settings.statusWeb);
  const statusUpdate = useSelector((state) => state.settings.statusUpdateWeb);
  const error = useSelector((state) => state.settings.error);

  const [account, setAccount] = useState({});


  useEffect(() => {
    if (data) {
      setAccount(data);
    }
  }, [data]);

  // const handleChangeUploadImg = useCallback((files) => {
  //   if (files) {
  //     setUploadedImageUrl({
  //       file: files,
  //       name: 'logo',
  //     });
  //   }
  // }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: account.name || '',
      address: account.address || '',
      phone: account.phone || '',
      cccd: account.cccd || '',
      bankAccount: account.bankAccount || '',
      avatar: account.avatar || '',
      bankHolder: account.bankHolder || '',
      bankName: account.bankName || '',
    },
  });
  // useEffect(() => {
  //   dispatch(getConfigWebsite());
  // }, [dispatch]);
  const formikRef = useRef(formik);

  useEffect(() => {
    if (status === 'successful' && data) {
      setAccount(data);
      formikRef.current.setValues(data);
    }
  }, [status, data]);
  useEffect(() => {
    if (statusUpdate === 'successful' && data) {
      handleToast('success', 'Cập nhật thành công');
      setInputSelect('');
      dispatch(setStatus({ key: 'statusUpdateWeb', value: 'idle' }));
    }
    if (statusUpdate === 'failed') {
      handleToast('error', error);
    }
  }, [statusUpdate, data, error, dispatch]);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  // const handleSubmit = () => {
  //   if (formik.errors && Object.keys(formik.errors).length > 0) {
  //     Object.keys(formik.errors).forEach((key) => {
  //       handleToast('error', formik.errors[key]);
  //     });
  //     return;
  //   }
  //   const newValues = { ...formik.values }; // Create a shallow copy of formik.values
  //   delete newValues.logo; // Delete the 'logo' property
  //   delete newValues._id; // Delete the '_id' property
  //   // dispatch(updateConfigWebsite({ values: newValues }));
  // };
  const handleCancel = () => {
    formik.resetForm();
    setInputSelect('');
  };
  const handleUpdate = (name) => {
    console.log(formik.values[name]);
    if (formik.values[name] === account[name]) {
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
    console.log(values);
    dispatch(updateStaffById({ id : account._id, data: values }));
  };
  // const handleUpload = () => {
  //   if (uploadedImageUrl) {
  //     // dispatch(uploadConfigWebsite(uploadedImageUrl));
  //     setUploadedImageUrl(null);
  //   } else {
  //     handleToast('error', 'Chưa chọn ảnh');
  //   }
  // };
  const [inputSelect, setInputSelect] = useState('');
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tài khoản</Typography>
      </Stack>
      <form>
        <Grid2 container spacing={3}>
          <Grid2 xs={12} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center' }}>
              <Avatar
                alt="Remy Sharp"
                src="/static/mock-images/avatars/avatar_default.jpg"
                sx={{ width: 100, height: 100, margin: 'auto' }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {account?.name}
              </Typography>
            </Card>
          </Grid2>
          <Grid2 xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ padding: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Thông tin cá nhân
                </Typography>
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
                <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="inherit">
                    Lưu
                  </Button>
                </Stack>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
}
