import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { resetDelete, deleteCategory, fetchAllCategories } from 'src/redux/slices/categorySlices';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { handleToast } from 'src/hooks/toast';

import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import { IconButton } from '@mui/material';
import TableNoData from 'src/components/table/table-no-data';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import CategoryTableRow from '../category-table-row';
import CategoryTableHead from '../category-table-head';
import CategoryTableToolbar from '../category-table-toolbar';
import { renderCategoryParent } from '../utils';

// ----------------------------------------------------------------------

export default function CategoryPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const [dataCategories, setDataCategories] = useState([]);
  const statusDelete = useSelector((state) => state.categories.statusDelete);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCategories());
    } else if (status === 'failed') {
      handleToast('error', 'Có lỗi xảy ra. Vui lòng liên hệ IT');
    } else if (status === 'successful') {
      setDataCategories(categories);
    }
  }, [status, dispatch, error, categories]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa Danh mục thành công');
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
      const newSelecteds = dataCategories.map((n) => n._id);
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
    inputData: dataCategories,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'name',
  });

  const notFound = !dataFiltered.length && !!filterName;
  // to new category
  const navigate = useNavigate();

  const handleNewCategoryClick = () => {
    navigate('/category/create');
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteCategory(confirm));
  };
  const handleMultiDelete = () => {
    console.log(selected);
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
        label="những danh mục đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Danh mục</Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllCategories())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleNewCategoryClick}
        >
          Tạo mới danh mục
        </Button>
      </Stack>

      <Card>
        <CategoryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CategoryTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataCategories.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'slug', label: 'Slug' },
                  { id: 'parent', label: 'Danh mục cha' },
                  { id: 'order', label: 'Vị trí' },
                  { id: 'createdAt', label: 'Thời gian Tạo' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CategoryTableRow
                      id={row._id}
                      key={row._id}
                      name={row.name}
                      imageURL={row.imageURL}
                      createdAt={row.createdAt}
                      order={row.order}
                      slug={row.slug}
                      parent={renderCategoryParent(dataCategories, row.parentId)}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={handleDelete}
                      handleNavigate={() => navigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  col={3}
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataCategories.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Số hàng mỗi trang"
          count={dataCategories.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
