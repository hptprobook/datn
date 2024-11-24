import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import {
  creates,
  deletes,
  fetchAll,
  setStatus,
  deleteSupplier,
} from 'src/redux/slices/supplierSlices';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import { handleExport } from 'src/utils/excel';
import { IconEdit, IconExcel, IconDelete } from 'src/components/iconify/icon';
import ImportExcelModal from 'src/components/modal/import-modal';
import { IconButton } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

export default function SuppliersPage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [confirms, setConfirms] = useState(false);

  const [suppliers, setSuppliers] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.suppliers.suppliers);
  const status = useSelector((state) => state.suppliers.status);
  const error = useSelector((state) => state.suppliers.error);
  const statusDelete = useSelector((state) => state.suppliers.statusDelete);
  const statusCreate = useSelector((state) => state.suppliers.statusCreate);
  const dataCreates = useSelector((state) => state.suppliers.dataCreates);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);
  useEffect(() => {
    if (statusCreate === 'successful') {
      dispatch(fetchAll());
      dataCreates.successful.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      dispatch(fetchAll());
      handleToast('error', dataCreates.message || 'Thêm nhà cung cấp thất bại');
      dataCreates.errors.forEach((item) => {
        handleToast('error', item.message);
      });
      dataCreates.successful.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
  }, [statusCreate, dataCreates, dispatch]);
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

  const dispatchDelete = () => {
    dispatch(deleteSupplier(confirm));
  };

  const handleSave = (d) => {
    dispatch(creates(d));
  };
  const handleEditClick = (id) => () => {
    route.push(id);
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<IconEdit />}
          label="Sửa"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<IconDelete />}
          label="Xóa"
          onClick={() => setConfirm(id)}
          color="inherit"
        />,
      ],
    },
    { field: 'fullName', headerName: 'Tên nhà cung cấp', width: 200 },
    { field: 'companyName', headerName: 'Tên công ty', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 120 },
    { field: 'email', headerName: 'Email', width: 120 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 200 },
    { field: 'updatedAt', headerName: 'Ngày nhập', width: 200 },
    { field: 'registrationNumber', headerName: 'Số thuế', width: 120 },
    { field: 'rating', headerName: 'Đánh giá', width: 100 },
    { field: 'website', headerName: 'Trang web', width: 200 },
    { field: 'notes', headerName: 'Ghi chú', width: 200 },
  ];
  const handleDeleteMany = () => {
    dispatch(
      deletes({
        ids: rowSelectionModel,
      })
    );
    setRowSelectionModel([]);
  };
  return (
    <Container>
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={confirms}
        onAgree={handleDeleteMany}
        label="các nhà cung cấp đã chọn"
        onClose={() => setConfirms(false)}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Nhãn hàng</Typography>
          <Button
            variant="contained"
            onClick={() => handleExport(suppliers, 'Danh sách nhà cung cấp', 'suppliers')}
            color="inherit"
            startIcon={<IconExcel />}
          >
            Xuất Excel
          </Button>
          <ImportExcelModal
            validateKey={[
              '_id',
              'companyName',
              'fullName',
              'phone',
              'email',
              'address',
              'registrationNumber',
              'website',
              'rating',
              'notes',
            ]}
            columns={columns
              .filter(
                (col) =>
                  col.field !== 'createdAt' && col.field !== 'updatedAt' && col.field !== 'actions'
              )
              .map((col) => col)}
            onSave={handleSave}
            loading={statusCreate === 'loading'}
          />
          {rowSelectionModel.length > 0 && (
            <Button variant="text" color="error" onClick={() => setConfirms(true)}>
              Xóa nhiều
            </Button>
          )}
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
          Nhà cung cấp mới
        </Button>
      </Stack>
      <Card>
        <div style={{ width: '100%' }}>
          <DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  notes: false,
                  createdAt: false,
                  updatedAt: false,
                },
              },
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            loading={status === 'loading'}
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
            columns={columns}
            rows={suppliers}
            pageSizeOptions={[5, 10]}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            localeText={{
              noRowsLabel: 'Không có dữ liệu',
              MuiTablePagination: {
                labelRowsPerPage: 'Số dòng mỗi trang',
              },
              toolbarColumns: 'Cột',
              toolbarFilters: 'Lọc',
              toolbarExport: 'Xuất',
              toolbarExportCSV: 'Xuất CSV',
              toolbarExportPrint: 'In',
              toolbarExportExcel: 'Xuất Excel',
              toolbarDensity: 'Mật độ',
              toolbarDensityCompact: 'Nhỏ',
              toolbarDensityStandard: 'Bình thường',
              toolbarDensityComfortable: 'Lớn',
            }}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            selectionModel={rowSelectionModel}
          />
        </div>
      </Card>
      {/* <Card>
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
      </Card> */}
    </Container>
  );
}
