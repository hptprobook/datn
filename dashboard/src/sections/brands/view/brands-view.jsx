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
import { fetchAll, setStatus, deleteSupplier } from 'src/redux/slices/supplierSlices';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import TableEmptyRows from '../supplier-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import SupplierTableRow from '../supplier-table-row';
import SupplierTableToolbar from '../supplier-table-toolbar';
import SupplierTableHead from '../supplier-table-head';
import TableNoData from '../supplier-no-data';

// ----------------------------------------------------------------------

export default function BrandsPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirm, setConfirm] = useState(false);

  const [suppliers, setSuppliers] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.suppliers.suppliers);
  const status = useSelector((state) => state.suppliers.status);
  const error = useSelector((state) => state.suppliers.error);
  const statusDelete = useSelector((state) => state.suppliers.statusDelete);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setSuppliers(data);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa nhà cung cấp thành công!');
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
      const newSelected = suppliers.map((n) => n.name);
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
    inputData: suppliers,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const handleNavigate = (id) => {
    route.push(id);
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteSupplier(confirm));
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nhà cung cấp</Typography>
        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nhà cung cấp mới
        </Button>
      </Stack>

      <Card>
        <SupplierTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SupplierTableHead
                order={order}
                orderBy={orderBy}
                rowCount={suppliers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'companyName', label: 'Tên công ty' },
                  { id: 'fullName', label: 'Họ và tên' },
                  { id: 'phone', label: 'Số điện thoại' },
                  { id: 'email', label: 'Email' },
                  { id: 'registrationNumber', label: 'Mã số thuế' },
                  { id: 'website', label: 'Trang website' },
                  { id: 'rating', label: 'Đánh giá' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <SupplierTableRow
                      key={row._id}
                      companyName={row.companyName}
                      fullName={row.fullName}
                      phone={row.phone}
                      email={row.email}
                      registrationNumber={row.registrationNumber}
                      website={row.website}
                      rating={row.rating}
                      selected={selected.indexOf(row.companyName) !== -1} // Assuming the company name is used for selection
                      handleClick={(event) => handleClick(event, row._id)}
                      handleNavigate={() => handleNavigate(row._id)}
                      onDelete={() => handleDelete(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, suppliers.length)}
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
          count={suppliers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
