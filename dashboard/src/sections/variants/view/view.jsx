import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from 'react-redux';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import { handleToast } from 'src/hooks/toast';
import { SketchPicker } from 'react-color';
import {
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import {
  setStatus,
  createVariant,
  deleteVariant,
  fetchAllVariants,
  manyDeleteVariant,
  updateVariantById,
} from 'src/redux/slices/variantSlices';
import Grid2 from '@mui/material/Unstable_Grid2';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FormHelpTextError from 'src/components/errors/form-error';
import VariantsTableToolbar from '../variants-table-toolbar';
import VariantsTableHead from '../variants-table-head';
import VariantsTableRow from '../variants-table-row';

const variantsSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên là bắt buộc').min(1, 'Tên không được để trống'),
  type: Yup.string()
    .oneOf(['size', 'color'], 'Loại phải là một trong các giá trị sau: color, size.')
    .required('Loại là bắt buộc')
    .trim(),
  value: Yup.string()
    .trim()
    .required('Giá trị là bắt buộc.')
    .min(1, 'Giá trị không được để trống.')
    .max(10, 'Giá trị không được quá 10 ký tự'),
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
};
// ----------------------------------------------------------------------

export default function VariantsPage() {
  const dispatch = useDispatch();
  const [variants, setVariants] = useState([]);
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState(null);
  const data = useSelector((state) => state.variants.variants);
  const status = useSelector((state) => state.variants.status);
  const error = useSelector((state) => state.variants.error);
  const statusDelete = useSelector((state) => state.variants.statusDelete);
  const statusCreate = useSelector((state) => state.variants.statusCreate);
  const statusUpdate = useSelector((state) => state.variants.statusUpdate);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllVariants());
    } else if (status === 'failed') {
      handleToast('error', error?.message || 'Lấy dữ liệu biến thể thất bại');
    } else if (status === 'successful') {
      setVariants(data);
    }
  }, [status, dispatch, error, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa biến thể thành công');
      dispatch(fetchAllVariants());
      setSelected([]);
      dispatch(
        setStatus({
          key: 'statusDelete',
          value: 'idle',
        })
      );
    } else if (statusDelete === 'failed') {
      handleToast('error', error?.message || 'Xóa biến thể thất bại');
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
  }, [statusDelete, dispatch, error]);
  useEffect(() => {
    if (statusUpdate === 'successful') {
      handleToast('success', 'Cập nhật biến thể thành công');
      dispatch(fetchAllVariants());
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
    } else if (statusUpdate === 'failed') {
      handleToast('error', error?.message || 'Cập nhật biến thể thất bại');
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
    }
  }, [statusUpdate, dispatch, error]);

  useEffect(() => {
    if (statusCreate === 'successful') {
      handleToast('success', 'Tạo biến thể thành công');
      dispatch(fetchAllVariants());
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    } else if (statusCreate === 'failed') {
      handleToast('error', error?.message || 'Tạo biến thể thất bại');
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
  }, [statusCreate, dispatch, error]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [color, setColor] = useState('#fff');

  const route = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'color',
      value: '',
    },
    validationSchema: variantsSchema,
    onSubmit: (values) => {
      dispatch(createVariant(values));
    },
  });
  const formikUpdate = useFormik({
    initialValues: {
      name: variant?.name || '',
      type: variant?.type || 'color',
      value: variant?.value || '',
    },
    enableReinitialize: true,
    validationSchema: variantsSchema,
    onSubmit: (values) => {
      dispatch(
        updateVariantById({
          id: variant._id,
          data: values,
        })
      );
      setOpen(false);
      setVariant(null);
    },
  });

  const handleChangeColor = (c, e) => {
    setColor(c.hex);
    if (variant) {
      formikUpdate.setFieldValue('value', c.hex);
    }
    formik.setFieldValue('value', c.hex);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = variants.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: variants,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'name',
  });
  const [confirm, setConfirm] = useState(false);
  const handleDelete = () => {
    if (typeof confirm === 'string') {
      dispatch(deleteVariant(confirm));
    } else {
      dispatch(
        manyDeleteVariant({
          ids: selected,
        })
      );
    }
  };
  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenModal = (id) => {
    setOpen(true);
    const v = variants.find((item) => item._id === id);
    if (v.type === 'color') {
      setColor(v.value);
    }
    setVariant(v);
  };
  const handleCloseModal = () => {
    setOpen(false);
    setVariant(null);
  };
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-detail-title"
        aria-describedby="modal-detail-description"
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Box sx={style}>
          <form onSubmit={formikUpdate.handleSubmit}>
            <Stack spacing={2}>
              <Typography variant="h6">Tạo biến thể</Typography>

              <TextField
                fullWidth
                label="Tên"
                variant="outlined"
                name="name"
                value={formikUpdate.values.name}
                onChange={formikUpdate.handleChange}
                error={formikUpdate.touched.name && Boolean(formikUpdate.errors.name)}
                helperText={formikUpdate.touched.name && formikUpdate.errors.name}
              />
              <FormControl fullWidth>
                <InputLabel id="type-variants-select-label">Loại</InputLabel>
                <Select
                  labelId="type-variants-select-label"
                  id="type-variants-select"
                  value={formikUpdate.values.type}
                  error={formikUpdate.touched.type && Boolean(formikUpdate.errors.type)}
                  name="type"
                  label="Loại"
                  onChange={formikUpdate.handleChange}
                >
                  <MenuItem value="color">Màu</MenuItem>
                  <MenuItem value="size">Kích thước</MenuItem>
                </Select>
                <FormHelpTextError label={formikUpdate.touched.type && formikUpdate.errors.type} />
              </FormControl>
              {formikUpdate.values.type === 'color' ? (
                <SketchPicker color={color} onChange={handleChangeColor} />
              ) : (
                <TextField
                  fullWidth
                  label="Giá trị"
                  variant="outlined"
                  name="value"
                  value={formikUpdate.values.value}
                  onChange={formikUpdate.handleChange}
                  error={formikUpdate.touched.value && Boolean(formikUpdate.errors.value)}
                  helperText={formikUpdate.touched.value && formikUpdate.errors.value}
                />
              )}
              <Button type="submit" variant="contained" color="inherit">
                Lưu
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={handleDelete}
        onClose={() => setConfirm(false)}
        label="biến thể đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Biến thể</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllVariants())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => handleToast('info', 'Tính năng đang phát triển!')}
        >
          Nhập từ file
        </Button>
      </Stack>

      <Grid2 container spacing={2}>
        <Grid2 xs={4}>
          <Card
            sx={{
              p: 2,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Typography variant="h6">Tạo biến thể</Typography>

                <TextField
                  fullWidth
                  label="Tên"
                  variant="outlined"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <FormControl fullWidth>
                  <InputLabel id="type-variants-select-label">Loại</InputLabel>
                  <Select
                    labelId="type-variants-select-label"
                    id="type-variants-select"
                    value={formik.values.type}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    name="type"
                    label="Loại"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="color">Màu</MenuItem>
                    <MenuItem value="size">Kích thước</MenuItem>
                  </Select>
                  <FormHelpTextError label={formik.touched.type && formik.errors.type} />
                </FormControl>
                {formik.values.type === 'color' ? (
                  <SketchPicker color={color} onChange={handleChangeColor} />
                ) : (
                  <TextField
                    fullWidth
                    label="Giá trị"
                    variant="outlined"
                    name="value"
                    value={formik.values.value}
                    onChange={formik.handleChange}
                    error={formik.touched.value && Boolean(formik.errors.value)}
                    helperText={formik.touched.value && formik.errors.value}
                  />
                )}
                <Button type="submit" variant="contained" color="inherit">
                  Tạo
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid2>
        <Grid2 xs={8}>
          <Card>
            <VariantsTableToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              onDeleteMany={() => setConfirm(true)}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <VariantsTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={variants.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'name', label: 'Tên' },
                      { id: 'value', label: 'Giá trị' },
                      { id: 'type', label: 'Kiểu' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <VariantsTableRow
                          id={row._id}
                          key={row._id}
                          name={row.name}
                          type={row.type}
                          value={row.value}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={(event) => handleClick(event, row._id)}
                          onDelete={() => setConfirm(row._id)}
                          handleNavigate={() => route.push(row._id)}
                          onClickRow={() => handleOpenModal(row._id)}
                        />
                      ))}

                    <TableEmptyRows
                      col={5}
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, variants.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              labelRowsPerPage="Số dòng mỗi trang"
              count={variants.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
