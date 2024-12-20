import { useRef, useState, useEffect } from 'react';

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

import { deleteUser, resetDelete, fetchAllUsers, getUsersExport } from 'src/redux/slices/userSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import { handleToast } from 'src/hooks/toast';

import { IconButton } from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import TableNoData from 'src/components/table/table-no-data';
import { applyFilter, getComparator } from 'src/components/table/utils';
import { debounce } from 'lodash';
import TableToolbar from 'src/components/table/table-tool-bar';
import { handleExport } from 'src/utils/excel';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';

// ----------------------------------------------------------------------

export default function UserPage() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const data = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const statusDelete = useSelector((state) => state.users.statusDelete);

  const getUsers = (p, l) => {
    dispatch(
      fetchAllUsers({
        page: p,
        limit: l,
      })
    );
  };

  useEffect(() => {
    if (status === 'idle') {
      getUsers(1, 5);
    } else if (status === 'failed') {
      console.error(error);
    } else if (status === 'successful') {
      setUsers(data.result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
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
    getUsers(newPage + 1, rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    getUsers(1, event.target.value);
  };

  const debounceSearch = useRef(
    debounce((value) => {
      dispatch(
        fetchAllUsers({
          search: value,
          page: 1,
          limit: rowsPerPage,
        })
      );
    }, 800)
  ).current;

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    debounceSearch(event.target.value); // Gọi hàm debounce
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
  });
  const [confirm, setConfirm] = useState(false);
  const dispatchDelete = () => {
    dispatch(deleteUser(confirm));
  };
  const notFound = !dataFiltered.length && !!filterName;
  const handleExportExcel = (d) => {
    const start = Number(d.start);
    const limit = Number(d.limit);
    if (start < 1 || limit < 1) {
      handleToast('error', 'Số nhập vào phải lớn hơn 0');
      return;
    }
    dispatch(
      getUsersExport({
        start,
        limit,
      })
    ).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        handleExport(res.payload.result, 'Danh sách người dùng', 'khach-hang');
      }
    });
  };
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
        label="người dùng đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Người dùng</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => getUsers(page + 1, rowsPerPage)}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => route.push('create')}
          >
            Thêm người dùng
          </Button>
        </Stack>
      </Stack>

      <Card>
        <TableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholderLabel="Tìm kiếm người dùng..."
          onExport={handleExportExcel}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'email', label: 'Email' },
                  { id: 'isVerified', label: 'Thông báo', align: 'center' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <UserTableRow
                    id={row._id}
                    key={row._id}
                    name={row.name}
                    status={row.role}
                    email={row.email}
                    // avatarUrl={row.avatarUrl}
                    isVerified={row.allowNotifies}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleClick(event, row._id)}
                    onDelete={() => setConfirm(row._id)}
                    handleNavigate={() => route.push(row._id)}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Số dòng mỗi trang"
          count={data.count || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
