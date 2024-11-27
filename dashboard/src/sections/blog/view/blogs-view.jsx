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
  fetchAllBlogs,
  fetchBlogById,
  deleteBlogtById,
} from 'src/redux/slices/blogSlice';
import { handleToast } from 'src/hooks/toast';

import Scrollbar from 'src/components/scrollbar';

import ConfirmDelete from 'src/components/modal/confirm-delete';
import LoadingFull from 'src/components/loading/loading-full';
import { Drawer, IconButton } from '@mui/material';
import { IconAdd, IconRefresh } from 'src/components/iconify/icon';
import TableNoData from 'src/components/table/table-no-data';
import BlogTableRow from '../blog-table-row';
import BlogTableHead from '../blog-table-head';
import BlogTableToolbar from '../blog-table-toolbar';
import BlogCard from '../blog-card';

import { applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function BlogView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const status = useSelector((state) => state.blogs.status);
  const statusDelete = useSelector((state) => state.blogs.statusDelete);
  const error = useSelector((state) => state.blogs.error);
  const [blogsList, setBlogsList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const blog = useSelector((state) => state.blogs.blog);

  const getBlogs = ({ p = 0, limit = rowsPerPage }) => {
    dispatch(
      fetchAllBlogs({
        page: p,
        limit,
      })
    );
  };
  useEffect(() => {
    getBlogs({
      p: page,
      limit: rowsPerPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleDrawer = (value) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (value) {
      dispatch(fetchBlogById({ id: value }));
    } else {
      dispatch(setStatus({ key: 'blog', value: null }));
    }
    setOpen(!open);
  };
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa bài viết thành công!');
      getBlogs({
        p: page,
        limit: rowsPerPage,
      });
    }
    if (statusDelete === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
    }
    dispatch(setStatus({ key: 'statusDelete', value: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDelete, dispatch, error]);

  useEffect(() => {
    if (status === 'failed') {
      handleToast('error', 'Có lỗi xảy ra vui lòng thử lại!');
    } else if (status === 'successful') {
      setBlogsList(blogs.data);
    }
  }, [blogs, status]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = blogsList.map((n) => n._id);
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
    getBlogs({
      p: newPage + 1,
      limit: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    getBlogs({
      p: 1,
      limit: parseInt(event.target.value, 10),
    });
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: blogsList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteBlogtById(confirm));
  };
  const handleMultiDelete = () => {
    console.log(selected);
  };
  const handleNewBlogClick = () => {
    navigate('/blog/create');
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
        label="Những bài viết đã chọn"
      />
      <Drawer anchor="right" open={open} onClose={toggleDrawer()}>
        <BlogCard status={status} blog={blog} author={blog?.authName} />
      </Drawer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Bài viết</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => getBlogs({ p: page, limit: rowsPerPage })}
          >
            <IconRefresh />
          </IconButton>
        </Stack>

        <Button
          onClick={handleNewBlogClick}
          variant="contained"
          color="inherit"
          startIcon={<IconAdd />}
        >
          Tạo bài viết
        </Button>
      </Stack>

      <Card>
        <BlogTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BlogTableHead
                order={order}
                orderBy={orderBy}
                rowCount={blogsList?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'thumbnail', label: 'Tên' },
                  { id: 'slug', label: 'Đường dẫn' },
                  { id: 'authName', label: 'Tên tác giả', align: 'center' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <BlogTableRow
                    onClick={toggleDrawer(row._id)}
                    id={row._id}
                    key={row._id}
                    title={row.title}
                    slug={row.slug}
                    thumbnail={row.thumbnail}
                    status={row.status}
                    authName={row.authName}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleClick(event, row._id)}
                    onDelete={handleDelete}
                    handleNavigate={() => navigate(row._id)}
                  />
                ))}


                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage="Số bài viết mỗi trang"
          count={blogs?.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
