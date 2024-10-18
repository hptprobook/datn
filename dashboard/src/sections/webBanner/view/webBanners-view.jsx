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

import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAll,
  resetDelete
} from 'src/redux/slices/webBannerSlice';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableNoData from 'src/components/table/table-no-data';
import WebBannerTableRow from '../webBanner-table-row';

import WebBannerTableToolbar from '../webBanner-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import WebBannerTableHead from '../webBanner-table-head';

// ----------------------------------------------------------------------

export default function WebBannersPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [webBanners, setWebBanners] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.webBanners.webBanners);
  const status = useSelector((state) => state.webBanners.status);
  const statusDelete = useSelector((state) => state.webBanners.statusDelete);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setWebBanners(data);
    }
  }, [status, dispatch, data]);

  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa Bảng quảng cáo thành công');
      dispatch(fetchAll());
      dispatch(resetDelete());
    }
  }, [statusDelete, dispatch]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = webBanners.map((n) => n._id);
      setSelected(newSelected);
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
    inputData: webBanners,
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
    // dispatch(deleteCoupon(confirm));
  };
  const handleMultiDelete = () => {
    setSelected([]);
    // dispatch(deleteManyCoupon(selected));
  };
  const notFound = !dataFiltered.length && !!filterName;

  const [confirm, setConfirm] = useState(false);
  const [confirmMulti, setConfirmMulti] = useState(false);
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={!!confirmMulti}
        onAgree={handleMultiDelete}
        onClose={() => setConfirmMulti(false)}
        label="những bảng quảng cáo đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Bảng quảng cáo </Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAll())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Tạo bảng quảng cáo
        </Button>
      </Stack>

      <Card>
        <WebBannerTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <WebBannerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={webBanners.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'title', label: 'Tiêu đề' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'url', label: 'Đường dẫn' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <WebBannerTableRow
                      id={row._id}
                      key={row._id}
                      image={row.image}
                      title={row.title}
                      description={row.description}
                      url={row.url}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={handleDelete}
                      handleNavigate={() => handleNavigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, webBanners.length)}
                  col={12}
                />

                {notFound && <TableNoData query={filterName} col={12}/>}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={webBanners.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
