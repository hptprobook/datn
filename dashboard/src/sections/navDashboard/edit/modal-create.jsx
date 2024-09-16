import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify/iconify';
import { useFormik } from 'formik';
import { navSchemaItem } from '../nav-schema';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 600,
  maxWidth: '100%',
  bgcolor: 'background.paper',
  border: '1px solid #222',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};
const ModalCreated = ({ open, handleClose, onCreate }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      path: '',
      icon: '',
    },
    validationSchema: navSchemaItem,
    onSubmit: (values) => {
      onCreate(values);
      formik.resetForm();
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
              <Button startIcon={<Iconify icon={formik.values.icon} />}>
                {formik.values.title}
              </Button>
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
                    id="icon-menu"
                    label="Icon"
                    name="icon"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.icon}
                    error={formik.touched.icon && Boolean(formik.errors.icon)}
                    helperText={formik.touched.icon && formik.errors.icon}
                  />
                </Grid>
            <Grid item xs={12}>
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
export default ModalCreated;

ModalCreated.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onCreate: PropTypes.func,
};
