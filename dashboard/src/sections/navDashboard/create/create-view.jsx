import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useDispatch, useSelector } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { TextField, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { handleToast } from 'src/hooks/toast';
import { createNav, resetStatus } from 'src/redux/slices/settingSlices';
import ModalCreated from './modal-create';
import { navSchema } from '../nav-schema';
import ContainerDragDropCreate from '../drag-create';
// ----------------------------------------------------------------------
export default function NavCreatedPage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [menuChild, setMenuChild] = useState([]);
  const [newChild, setNewChild] = useState([]);

  const status = useSelector((state) => state.settings.statusCreate);
  const error = useSelector((state) => state.settings.error);
  useEffect(() => {
    if (status === 'succeeded') {
      handleToast('success', 'Tạo mới thành công');
      setNewChild([]);
      setMenuChild([]);
      dispatch(resetStatus());
    }
    if (status === 'failed') {
      handleToast('error', error);
    }
  }, [status, error, dispatch]);

  const onCreate = (data) => {
    const existingItem = menuChild.find((item) => item.path === data.path);
    if (existingItem) {
      handleToast('error', 'Đường dẫn đã tồn tại');
      return;
    }
    data.index = menuChild.length;
    setMenuChild([...menuChild, data]);
    // setOpen(false);
  };
  const handleUpdateChild = (id) => {
    const newMenuChild = menuChild.filter((item) => item.index !== id);
    newMenuChild.forEach((item, index) => {
      item.index = index;
    });
    setMenuChild(newMenuChild);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      path: '',
      index: '',
      icon: '',
    },
    validationSchema: navSchema,
    onSubmit: (values) => {
      if (menuChild.length > 0 && newChild.length > 0) {
        const child = newChild.map((item) => ({
          title: item.title,
          path: item.path,
          icon: item.icon,
        }));
        values.child = child;
      }
      dispatch(createNav({ values }));
      formik.resetForm();
    },
  });

  const handleGetNewNav = (data) => {
    setNewChild(data);
  };
  return (
    <Container>
      <ModalCreated open={open} handleClose={handleClose} onCreate={onCreate} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tạo mới</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="material-symbols:help" />}
        >
          Hỗ trợ
        </Button>
      </Stack>

      <Grid2 container spacing={3}>
        <Grid2 xs={8}>
          <Card sx={{ p: 3 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid2 container spacing={1}>
                <Grid2 xs={6}>
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
                </Grid2>
                <Grid2 xs={6}>
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
                </Grid2>
                <Grid2 xs={6}>
                  <TextField
                    fullWidth
                    id="index-menu"
                    label="Vị trí menu"
                    name="index"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.index}
                    error={formik.touched.index && Boolean(formik.errors.index)}
                    helperText={formik.touched.index && formik.errors.index}
                  />
                </Grid2>
                <Grid2 xs={6}>
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
                </Grid2>
                <Grid2 xs={12}>
                  <Button variant="contained" type="submit" sx={{ float: 'right' }}>
                    Lưu
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </Card>
        </Grid2>
        <Grid2 xs={4}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h6">Tạo mới menu con</Typography>

              <IconButton
                aria-label="load"
                variant="contained"
                color="inherit"
                onClick={() => setOpen(true)}
              >
                <Iconify icon="eva:plus-fill" />
              </IconButton>
            </Stack>
            <DndProvider backend={HTML5Backend}>
              {menuChild.length > 0 && menuChild ? (
                <ContainerDragDropCreate
                  nav={menuChild}
                  onUpdateChild={handleUpdateChild}
                  getNewNav={handleGetNewNav}
                />
              ) : null}
            </DndProvider>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
