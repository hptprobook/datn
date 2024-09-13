import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify/iconify';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const navSchema = Yup.object().shape({
  path: Yup.string()
    .required('Đường dẫn là bắt buộc')
    .typeError('Đường dẫn phải là chuỗi')
    .min(2, 'Đường dẫn phải có ít nhất 2 ký tự')
    .max(60, 'Đường dẫn không được quá 60 ký tự'),
  title: Yup.string()
    .required('Tên menu là bắt buộc')
    .typeError('Tên menu phải là chuỗi')
    .min(2, 'Tên menu phải có ít nhất 2 ký tự')
    .max(60, 'Tên menu không được quá 60 ký tự'),
  index: Yup.number()
    .required('Vị trí là bắt buộc')
    .integer('Vị trí phải là số nguyên')
    .min(1, 'Vị trí phải lớn hơn hoặc bằng 1')
    .max(100, 'Vị trí không được quá 100'),
  icon: Yup.string()
    .required('Icon là bắt buộc')
    .typeError('Icon phải là chuỗi')
    .min(2, 'Icon phải có ít nhất 2 ký tự')
    .max(60, 'Icon không được quá 60 ký tự'),
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 800,
  maxWidth: '100%',
  bgcolor: 'background.paper',
  border: '1px solid #222',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};
const ModalEdit = ({ open, handleClose, onUpdate, data }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data.title,
      path: data.path,
      index: data.index,
      icon: data.icon,
    },
    validationSchema: navSchema,
    onSubmit: (values) => {
      onUpdate({ id: data._id, values });
    },
  });
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Chỉnh sửa menu
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button startIcon={<Iconify icon={data.icon} />}>{data.title}</Button>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="title-menu"
                label="Tên menu"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="path-menu"
                label="Đường dẫn menu"
                name="path"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.path}
                error={formik.touched.path && Boolean(formik.errors.path)}
                helperText={formik.touched.path && formik.errors.path}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="index-menu"
                label="Vị trí menu"
                name="index"
                disabled
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.index}
                error={formik.touched.index && Boolean(formik.errors.index)}
                helperText={formik.touched.index && formik.errors.index}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Icon</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  name="icon"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.icon}
                  error={formik.touched.icon && Boolean(formik.errors.icon)}
                  helperText={formik.touched.icon && formik.errors.icon}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon={data.icon} />
                    </InputAdornment>
                  }
                  label="Icon"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" sx={{ float: 'right' }}>
                Lưu
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalEdit;

ModalEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object,
  onUpdate: PropTypes.func,
};
