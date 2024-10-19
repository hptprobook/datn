import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useDispatch, useSelector } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Select, MenuItem, TextField, IconButton, InputLabel, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { handleToast } from 'src/hooks/toast';
import { updateNav, getNavById, resetStatus } from 'src/redux/slices/settingSlices';
import { useParams } from 'react-router-dom';
import { arrPath } from 'src/routes/utils';
import IconModal from 'src/components/modal/modal-icon';
import { navSchema, navSchemaItem } from '../nav-schema';
import ContainerDragDropCreate from '../drag-create';

// ----------------------------------------------------------------------
export default function NavUpdatePage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [menuChild, setMenuChild] = useState([]);
  const [newChild, setNewChild] = useState([]);
  const [nav, setNav] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getNavById({ id })).then((response) => {
        setNav(response.payload);
        if (response.payload.child) {
          const child = response.payload.child.map((item, index) => ({
            ...item,
            index,
          }));
          setMenuChild(child);
        }
      });
    }
  }, [id, dispatch]);

  const status = useSelector((state) => state.settings.statusUpdate);
  const error = useSelector((state) => state.settings.error);
  useEffect(() => {
    if (status === 'succeeded') {
      handleToast('success', 'Cập nhật thành công');
      dispatch(resetStatus());
    }
    if (status === 'failed') {
      handleToast('error', error);
    }
  }, [status, error, dispatch]);

  const handleUpdateChild = (_id) => {
    const newMenuChild = menuChild.filter((item) => item.index !== _id);
    newMenuChild.forEach((item, index) => {
      item.index = index;
    });
    setMenuChild(newMenuChild);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: nav.title || '',
      path: nav.path || '',
      index: nav.index !== undefined ? nav.index : '',
      icon: nav.icon || '',
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
      dispatch(updateNav({ id, values }));
    },
  });
  const formikChild = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      path: '',
      icon: '',
    },
    validationSchema: navSchemaItem,
    onSubmit: (values) => {
      if (values.icon === '') {
        handleToast('error', 'Icon không được để trống');
        return;
      }
      const existingItem = menuChild.find((item) => item.path === values.path);
      if (existingItem) {
        handleToast('error', 'Đường dẫn đã tồn tại');
        return;
      }
      values.index = menuChild.length;
      setMenuChild([...menuChild, values]);
      formik.resetForm();
    },
  });
  const handleGetNewNav = (data) => {
    setNewChild(data);
  };
  const handleSubmit = (icon) => {
    console.log(icon);
    // formik.setFieldValue('icon', icon);
    if (open === 'formik') {
      formik.setFieldValue('icon', icon);
    } else {
      formikChild.setFieldValue('icon', icon);
    }
    setOpen(false);
  };

  return (
    <Container>
      <IconModal open={open && true} onClose={() => setOpen(false)} onSubmit={handleSubmit} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Sửa menu</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="material-symbols:help" />}
        >
          Hỗ trợ
        </Button>
      </Stack>

      <Grid2 container spacing={3}>
        {nav.title !== '' && (
          <Grid2 xs={8}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Thông tin menu</Typography>
                {formik.values.icon ? (
                  <IconButton onClick={() => setOpen('formik')}>
                    <Iconify icon={formik.values.icon} size={24} />
                  </IconButton>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="inherit"
                    onClick={() => setOpen('formik')}
                  >
                    Chọn icon
                  </Button>
                )}
              </Stack>
              <form onSubmit={formik.handleSubmit}>
                <Grid2 container spacing={1}>
                  <Grid2 xs={12}>
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
                  <Grid2 xs={4}>
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
                  <Grid2 xs={8}>
                    <FormControl fullWidth>
                      <InputLabel id="create-path-select-label">Đường dẫn</InputLabel>
                      <Select
                        labelId="create-path-select-label"
                        id="create-path-select"
                        value={formik.values.path}
                        label="Đường dẫn"
                        name="path"
                        onChange={formik.handleChange}
                      >
                        {arrPath.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>

                  <Grid2 xs={12}>
                    <Button
                      variant="contained"
                      color="inherit"
                      type="submit"
                      sx={{ float: 'right' }}
                    >
                      Cập nhật
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            </Card>
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Tạo mới menu con </Typography>
                {formikChild.values.icon ? (
                  <IconButton onClick={() => setOpen('formikChild')}>
                    <Iconify icon={formikChild.values.icon} size={24} />
                  </IconButton>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="inherit"
                    onClick={() => setOpen('formikChild')}
                  >
                    Chọn icon
                  </Button>
                )}
              </Stack>
              <form onSubmit={formikChild.handleSubmit}>
                <Grid2 container spacing={1}>
                  <Grid2 xs={12}>
                    <TextField
                      fullWidth
                      id="title-menu"
                      label="Tên menu"
                      name="title"
                      onChange={formikChild.handleChange}
                      onBlur={formikChild.handleBlur}
                      value={formikChild.values.title}
                      error={formikChild.touched.title && Boolean(formikChild.errors.title)}
                      helperText={formikChild.touched.title && formikChild.errors.title}
                    />
                  </Grid2>
                  <Grid2 xs={8}>
                    <FormControl fullWidth>
                      <InputLabel id="create-path-select-label">Đường dẫn</InputLabel>
                      <Select
                        labelId="create-path-select-label"
                        id="create-path-select"
                        value={formikChild.values.path}
                        label="Đường dẫn"
                        name="path"
                        onChange={formikChild.handleChange}
                      >
                        {arrPath.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>
                  <Grid2 xs={4}>
                    <TextField
                      fullWidth
                      id="index-menu"
                      label="Vị trí menu"
                      name="index"
                      onChange={formikChild.handleChange}
                      onBlur={formikChild.handleBlur}
                      value={formikChild.values.index}
                      error={formikChild.touched.index && Boolean(formikChild.errors.index)}
                      helperText={formikChild.touched.index && formikChild.errors.index}
                    />
                  </Grid2>
                  <Grid2 xs={12}>
                    <Button
                      variant="contained"
                      color="inherit"
                      type="submit"
                      sx={{ float: 'right' }}
                    >
                      Lưu
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            </Card>
          </Grid2>
        )}
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
