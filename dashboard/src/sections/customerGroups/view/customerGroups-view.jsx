import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  setStatus,
  fetchAllCustomerGroup,
  deleteOneCustomerGroup,
} from 'src/redux/slices/CustomerGroupSlice';
import { handleToast } from 'src/hooks/toast';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ConfirmDelete from 'src/components/modal/confirm-delete';
import LoadingFull from 'src/components/loading/loading-full';
import { IconButton } from '@mui/material';
import TableNoData from '../table-no-data';
import CustomerGroupTableRow from '../customerGroup-table-row';
import CustomerGroupTableHead from '../customerGroup-table-head';
import TableEmptyRows from '../table-empty-rows';
import CustomerGroupTableToolbar from '../customerGroup-table-toolbar';

import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function CustomerGroupView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const customerGroups = useSelector((state) => state.customerGroups.customerGroups);
  const status = useSelector((state) => state.customerGroups.status);
  const statusDelete = useSelector((state) => state.customerGroups.statusDelete);
  const error = useSelector((state) => state.customerGroups.error);
  const [CGList, setCGList] = React.useState([]);

  useEffect(() => {
    dispatch(fetchAllCustomerGroup());
  }, [dispatch]);

  useEffect(() => {
    if (statusDelete === 'successful') {
      dispatch(setStatus({ key: 'statusDelete', value: '' }));
      handleToast('success', 'Xóa nhóm khách hàng thành công!');
      dispatch(fetchAllCustomerGroup());
    }
    if (statusDelete === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
    }
  }, [statusDelete, dispatch, error]);

  useEffect(() => {
    if (status === 'failed') {
      handleToast('error', 'Có lỗi xảy ra vui lòng thử lại!');
    } else if (status === 'successful') {
      setCGList(customerGroups);
    }
  }, [customerGroups, status]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CGList.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    inputData: CGList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    console.log(confirm);
    dispatch(deleteOneCustomerGroup(confirm));
  };
  const handleMultiDelete = () => {
    console.log(selected);
  };
  const handleNewBlogClick = () => {
    navigate('/customerGroups/create');
  };

  const [confirm, setConfirm] = useState(false);
  const [confirmMulti, setConfirmMulti] = useState(false);
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={!!confirmMulti}
        onAgree={handleMultiDelete}
        onClose={() => setConfirmMulti(false)}
        label="Những nhóm khách hàng đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Nhóm khách hàng</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllCustomerGroup())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button
          onClick={handleNewBlogClick}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Tạo Nhóm Khách Hàng
        </Button>
      </Stack>

      <Card>
        <CustomerGroupTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomerGroupTableHead
                order={order}
                orderBy={orderBy}
                rowCount={CGList.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'note', label: 'Ghi chú' },
                  { id: 'manual', label: 'Thủ công', align: 'center' },
                  { id: 'satisfy', label: 'Thỏa mãn' },
                  { id: 'createdAt', label: 'Ngày tạo' },
                  { id: 'updatedAt', label: 'Ngày cập nhật' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CustomerGroupTableRow
                      id={row._id}
                      key={row._id}
                      name={row.name}
                      note={row.note}
                      manual={row.manual}
                      satisfy={row.satisfy}
                      createdAt={row.createdAt}
                      updatedAt={row.updatedAt}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={handleDelete}
                      handleNavigate={() => navigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, CGList.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={CGList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
