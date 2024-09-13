import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { fetchNav, removeNav, resetStatus, updateNav } from 'src/redux/slices/settingSlices';
import { handleToast } from 'src/hooks/toast';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, IconButton, InputAdornment, Modal, TextField } from '@mui/material';
import { PropTypes } from 'prop-types';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import NavTableRow from '../nav-table-row';
import NavTableToolbar from '../nav-table-toolbar';
import NavTableHead from '../nav-table-head';
import ContainerDragDrop from '../drag-edit';
import ModalEdit from './modal-edit';

// ----------------------------------------------------------------------

export default function NavDashboardPage() {
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const dispactch = useDispatch();

  const [nav, setNav] = useState([]);

  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState({});

  const dataNav = useSelector((state) => state.settings.nav);
  const status = useSelector((state) => state.settings.status);
  const statusDelete = useSelector((state) => state.settings.statusDelete);
  const statusUpdate = useSelector((state) => state.settings.statusUpdate);
  const handleData = (data) => {
    const sortedData = [...data].sort((a, b) => a.index - b.index);
    setNav(sortedData);
  };
  useEffect(() => {
    if (status === 'succeeded') {
      handleData(dataNav);
    }
    if (status === 'failed') {
      handleToast('error', 'Không thể lấy dữ liệu');
    }
  }, [dataNav, status]);

  useEffect(() => {
    if (statusDelete === 'succeeded') {
      handleToast('success', 'Xóa thành công');
      handleData(dataNav);
      dispactch(resetStatus());
    }
    if (statusDelete === 'failed') {
      handleToast('error', 'Xóa thất bại');
    }
  }, [statusDelete, dispactch, dataNav]);
  useEffect(() => {
    if (statusUpdate === 'succeeded') {
      setOpen(false);
      dispactch(resetStatus());
      handleData(dataNav);
      handleToast('success', 'Cập nhật thành công');
    }
    if (statusUpdate === 'failed') {
      handleToast('error', 'Cập nhật thất bại');
    }
  }, [statusUpdate, dispactch, dataNav]);

  useEffect(() => {
    dispactch(fetchNav());
  }, [dispactch]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleModal = (modal) => {
    setOpen(!open);
    if (modal) {
      setDataModal(modal);
    }
  };
  const onUpdate = (data) => {
    dispactch(updateNav(data));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = nav.map((n) => n.title);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: nav,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleDelete = (id) => {
    dispactch(removeNav({ id }));
  };
  const handleUpdate = (id) => {
    nav.find((item) => item._id === id && handleModal(item));
  };
  return (
    <Container>
      <ModalEdit open={open} handleClose={handleModal} data={dataModal} onUpdate={onUpdate} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Menu quản trị</Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispactch(fetchNav())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Tạo menu mới
        </Button>
      </Stack>

      <Grid2 container spacing={3}>
        <Grid2 xs={8}>
          <Card>
            <NavTableToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset', pb: 4 }}>
                <Table>
                  <NavTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'title', label: 'Tên menu' },
                      { id: 'index', label: 'Vị trí' },
                      { id: 'haveChild', label: 'Menu con ', align: 'center' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered.map((row) => (
                      <NavTableRow
                        key={row._id}
                        title={row.title}
                        icon={row.icon}
                        havechild={!!row.child}
                        index={row.index}
                        path={row.path}
                        selected={selected.indexOf(row.title) !== -1}
                        handleClick={(event) => handleClick(event, row.title)}
                        handleDelete={() => handleDelete(row._id)}
                        handleUpdate={() => handleUpdate(row._id)}
                      />
                    ))}

                    <TableEmptyRows height={77} emptyRows={emptyRows(nav.length)} />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        </Grid2>
        <Grid2 xs={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Chỉnh sửa vị trí
            </Typography>
            <DndProvider backend={HTML5Backend}>
              {nav.length > 0 && nav ? <ContainerDragDrop nav={nav} /> : null}
            </DndProvider>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
