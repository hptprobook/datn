import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import { IconButton } from '@mui/material';
import {
  fetchAll,
  setStatus,
  deleteWarehouse,
  createWarehouses,
  deleteWarehouses,
} from 'src/redux/slices/warehouseSlices';
import { handleExport } from 'src/utils/excel';
import { IconEdit, IconExcel, IconDelete } from 'src/components/iconify/icon';
import ImportExcelModal from 'src/components/modal/import-modal';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

export default function WareHousePage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [confirms, setConfirms] = useState(false);

  const [warehouses, setWarehouses] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.warehouses.warehouses);
  const status = useSelector((state) => state.warehouses.status);
  const error = useSelector((state) => state.warehouses.error);
  const statusDelete = useSelector((state) => state.warehouses.statusDelete);
  const statusCreate = useSelector((state) => state.warehouses.statusCreate);
  const dataCreates = useSelector((state) => state.warehouses.dataCreates);
  const dateDeletes = useSelector((state) => state.warehouses.dataDeletes);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setWarehouses(data);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa kho thành công!');
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
      dispatch(fetchAll());
      dateDeletes?.successful.forEach((item) => {
        handleToast('success', item.message);
      });
    }
    if (statusDelete === 'failed') {
      handleToast('error', error.messages);
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
      dateDeletes?.errors.forEach((item) => {
        handleToast('error', item.message);
      });
      dateDeletes?.successful.forEach((item) => {
        handleToast('success', item.message);
      });
    }
  }, [statusDelete, dispatch, error, dateDeletes]);
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
      handleToast('error', dataCreates.message || 'Thêm biến thể thất bại');
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
  const dispatchDelete = () => {
    dispatch(deleteWarehouse(confirm));
  };
  const handleSave = (d) => {
    dispatch(createWarehouses(d));
  };
  const handleEditClick = (id) => () => {
    route.push(id);
  };
  const handleDeleteMany = () => {
    dispatch(
      deleteWarehouses({
        ids: rowSelectionModel,
      })
    );
    setConfirms(false);
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
    { field: 'name', headerName: 'Tên nhãn hàng', width: 200 },
    { field: 'capacity', headerName: 'Sức chứa', width: 100 },
    { field: 'currentQuantity', headerName: 'Hiện tại', width: 100 },
    { field: 'status', headerName: 'Trạng thái', width: 200 },
    { field: 'location', headerName: 'Địa chỉ', width: 200 },
    { field: 'ward_id', headerName: 'Mã xã', width: 100 },
    { field: 'district_id', headerName: 'Mã huyện', width: 100 },
    { field: 'province_id', headerName: 'Mã tỉnh', width: 100 },
    { field: 'longitude', headerName: 'Kinh tuyến', width: 100 },
    { field: 'latitude', headerName: 'Vĩ tuyến', width: 100 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 200 },
    { field: 'updatedAt', headerName: 'Ngày nhập', width: 200 },
  ];
  return (
    <Container>
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
        label="kho đã chọn"
      />
      <ConfirmDelete
        openConfirm={confirms}
        onAgree={handleDeleteMany}
        label="các kho đã chọn"
        onClose={() => setConfirms(false)}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Kho</Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAll())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          {rowSelectionModel.length > 0 && (
            <Button variant="text" color="error" onClick={() => setConfirms(true)}>
              Xóa nhiều
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => handleExport(warehouses, 'Danh sách kho', 'warehouses')}
            color="inherit"
            startIcon={<IconExcel />}
          >
            Xuất Excel
          </Button>
          <ImportExcelModal
            validateKey={[
              '_id',
              'name',
              'location',
              'longitude',
              'latitude',
              'province_id',
              'district_id',
              'ward_id',
              'status',
              'capacity',
              'currentQuantity',
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
          <Button
            variant="contained"
            onClick={() => route.push('create')}
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Kho mới
          </Button>
        </Stack>
      </Stack>

      <Card>
        <div style={{ width: '100%', overflow: 'auto' }}>
          <DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  status: false,
                  createdAt: false,
                  updatedAt: false,
                  longitude: false,
                  latitude: false,
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
            rows={warehouses}
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
    </Container>
  );
}
