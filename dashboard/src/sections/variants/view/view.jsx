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
import { useDispatch, useSelector } from 'react-redux';

import { deleteUser, resetDelete, fetchAllUsers } from 'src/redux/slices/userSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import { handleToast } from 'src/hooks/toast';

import { IconButton } from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { fetchAllVariants } from 'src/redux/slices/variantSlices';
import VariantsTableToolbar from '../variants-table-toolbar';
import VariantsTableHead from '../variants-table-head';
import VariantsTableRow from '../variants-table-row';

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

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
            Thêm biến thể
        </Button>
      </Stack>

      <Card>
        <VariantsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
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
                  { id: 'createdAt', label: 'Ngày tạo', },
                  { id: 'updatedAt', label: 'Ngày cập nhật' },
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
                      createdAt={row.createdAt}
                      updatedAt={row.updatedAt}
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
    </Container>
  );
}
