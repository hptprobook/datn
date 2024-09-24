import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import { fetchAll, setStatus, deleteBrand } from 'src/redux/slices/brandSlices';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import BrandTableHead from '../brand-table-head';
import BrandTableRow from '../brand-table-row';
import BrandTableToolbar from '../brand-table-toolbar';

// ----------------------------------------------------------------------

export default function BrandsPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirm, setConfirm] = useState(false);

  const [brands, setBrands] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.brands.brands);
  const status = useSelector((state) => state.brands.status);
  const error = useSelector((state) => state.brands.error);
  const statusDelete = useSelector((state) => state.brands.statusDelete);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setBrands(data);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa nhãn hàng thành công!');
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
      dispatch(fetchAll());
    }
    if (statusDelete === 'failed') {
      handleToast('error', error.messages);
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
  }, [statusDelete, dispatch, error]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = brands.map((n) => n.name);
      setSelected(newSelected);
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
    inputData: brands,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'name',
  });
  const handleNavigate = (id) => {
    route.push(id);
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteBrand(confirm));
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nhãn hàng</Typography>
        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nhãn hàng mới
        </Button>
      </Stack>

      <Card>
        <BrandTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BrandTableHead
                order={order}
                orderBy={orderBy}
                rowCount={brands.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên nhãn hàng' },
                  { id: 'slug', label: 'Slug' },
                  { id: 'createdAt', label: 'Ngày tạo' },
                  { id: 'updatedAt', label: 'Ngày nhập' },
                  { id: 'website', label: 'Trang chủ' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <BrandTableRow
                      key={row._id}
                      name={row.name}
                      status={row.status}
                      createdAt={row.createdAt}
                      updatedAt={row.updatedAt}
                      avatar={row.image}
                      slug={row.slug}
                      website={row.website}
                      selected={selected.indexOf(row.name) !== -1} // Assuming the company name is used for selection
                      handleClick={(event) => handleClick(event, row._id)}
                      handleNavigate={() => handleNavigate(row._id)}
                      onDelete={() => handleDelete(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, brands.length)}
                  col={6}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Số hàng trên trang"
          count={brands.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
