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

import { deleteUser, resetDelete, fetchAllUsers } from 'src/redux/slices/userSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import { handleToast } from 'src/hooks/toast';

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { fetchAllVariants } from 'src/redux/slices/variantSlices';
import Grid2 from '@mui/material/Unstable_Grid2';
import * as Yup from 'yup';
import VariantsTableToolbar from '../variants-table-toolbar';
import VariantsTableHead from '../variants-table-head';
import VariantsTableRow from '../variants-table-row';
import { useFormik } from 'formik';
import FormHelpTextError from 'src/components/errors/form-error';

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

// ----------------------------------------------------------------------

export default function VariantsPage() {
  const dispatch = useDispatch();
  const [variants, setVariants] = useState([]);

  const data = useSelector((state) => state.variants.variants);
  const status = useSelector((state) => state.variants.status);
  const error = useSelector((state) => state.variants.error);
  const statusDelete = useSelector((state) => state.variants.statusDelete);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllVariants());
    } else if (status === 'failed') {
      console.error(error);
    } else if (status === 'successful') {
      setVariants(data);
    }
  }, [status, dispatch, error, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa người dùng thành công');
      dispatch(resetDelete());
    }
  }, [statusDelete, dispatch]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const route = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      value: '',
    },
    validationSchema: variantsSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = variants.map((n) => n.name);
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
  const dispatchDelete = () => {
    dispatch(deleteUser(confirm));
  };
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
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
            onClick={() => dispatch(fetchAllUsers())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
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
                <Button type="submit" variant="contained" color="primary">
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
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          onDelete={() => setConfirm(row._id)}
                          handleNavigate={() => route.push(row._id)}
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
