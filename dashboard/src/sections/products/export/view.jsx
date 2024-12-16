/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Card, Modal, Button, styled, TextField } from '@mui/material';
import './styles.css';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, createsProduct, fetchAllProducts } from 'src/redux/slices/productSlice';
import { handleToast } from 'src/hooks/toast';
import { IconSave, IconUpload, IconDownload } from 'src/components/iconify/icon';
import { handleImportExcel } from 'src/utils/excel';
import { DataGrid } from '@mui/x-data-grid';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const validateKey = [
  '_id',
  'name',
  'thumbnail',
  'slug',
  'description',
  'price',
  'brand',
  'content',
  'status',
  'weight',
  'height',
  'inventory',
  'minInventory',
  'maxInventory',
  'cat_id',
  'statusStock',
  'variantPrice',
  'variantColor',
  'variantStock',
  'size',
  'sizePrice',
  'sizeStock',
  'sizeSku',
  'colorSku',
  'trading',
  'sale',
  'warehouseId',
  'capitalPrice',
  'marketPrice',
  'onlinePrice',
  'saleOff',
  'color',
  'image',
  'sellCount',
];
const backEnd = import.meta.env.VITE_BACKEND_APP_URL;
export default function ExportProductPage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();

  const { products, dataCreates, statusCreate } = useSelector((state) => state.products);
  const flattenData = (d) => {
    const rows = [];
    d.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.sizes.forEach((size) => {
          rows.push({
            _id: product._id,
            name: product.name,
            thumbnail: product.thumbnail,
            slug: product.slug,
            description: product.description,
            price: product.price,
            brand: product.brand,
            content: product.content,
            status: product.status,
            weight: product.weight,
            height: product.height,
            inventory: product.inventory,
            minInventory: product.minInventory,
            maxInventory: product.maxInventory,
            cat_id: product.cat_id,
            statusStock: product.statusStock,
            variantPrice: variant.price,
            variantColor: variant.color,
            variantStock: variant.stock,
            size: size.size,
            sizePrice: size.price,
            sizeStock: size.stock,
            sizeSku: size.sku,
            colorSku: variant.sku,
            trading: size.trading,
            sale: size.sale,
            warehouseId: variant.warehouseId,
            capitalPrice: variant.capitalPrice,
            marketPrice: variant.marketPrice,
            onlinePrice: variant.onlinePrice,
            saleOff: variant.saleOff,
            color: variant.color,
            image: variant.image,
            sellCount: variant.sellCount,
          });
        });
      });
    });
    return rows;
  };
  const restoreData = (flattenedData) => {
    const restoredData = [];

    flattenedData.forEach((item) => {
      // Kiểm tra sản phẩm đã tồn tại trong restoredData chưa
      if (item.slug === undefined) {
        handleToast('error', 'File không đúng định dạng');
        return;
      }
      let product = restoredData.find((p) => p.slug === item.slug);
      if (!product) {
        // Nếu chưa, thêm sản phẩm mới
        product = {
          _id: item._id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          brand: item.brand,
          inventory: item.inventory,
          minInventory: item.minInventory,
          maxInventory: item.maxInventory,
          status: item.status,
          weight: item.weight,
          height: item.height,
          content: item.content,
          thumbnail: item.thumbnail,
          cat_id: item.cat_id,
          statusStock: item.statusStock,
          variants: [],
        };
        restoredData.push(product);
      }

      // Kiểm tra biến thể đã tồn tại trong sản phẩm chưa
      let variant = product.variants.find(
        (v) => v.color === item.variantColor && v.price === item.variantPrice
      );
      if (!variant) {
        // Nếu chưa, thêm biến thể mới
        variant = {
          warehouseId: item.warehouseId,
          capitalPrice: item.capitalPrice,
          marketPrice: item.marketPrice,
          onlinePrice: item.onlinePrice,
          saleOff: item.saleOff,
          stock: item.variantStock,
          sku: item.colorSku,
          color: item.color,
          image: item.image,
          sellCount: item.sellCount,
          price: item.sizePrice,
          sizes: [],
        };
        product.variants.push(variant);
      }

      // Thêm kích thước vào biến thể
      variant.sizes.push({
        stock: item.sizeStock,
        sku: item.sizeSku,
        trading: item.trading,
        sale: item.sale,
        size: item.size,
        price: item.sizePrice,
      });
    });

    return restoredData;
  };

  const exportToExcel = (d, filename = 'san-pham.xlsx') => {
    // Xử lý JSON để "flatten" object/mảng (gỡ các nested structure)

    // Tạo một worksheet từ dữ liệu đã "flatten"
    const worksheet = XLSX.utils.json_to_sheet(d);

    // Tạo một workbook và gán worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Xuất file Excel
    XLSX.writeFile(workbook, filename);
  };
  const handleUploadFile = async (e) => {
    if (e.target.files.length === 0) return;
    const d = await handleImportExcel(e, validateKey);
    setData(restoreData(d));
  };
  const handleExportProduct = () => {
    if (limit < 1 || page < 1) {
      handleToast('error', 'Số trang và số lượng phải lớn hơn 0');
      return;
    }
    dispatch(
      fetchAllProducts({
        page,
        limit,
      })
    );
  };
  useEffect(() => {
    if (products?.products?.length > 0 && open === true) {
      exportToExcel(flattenData(products.products));
    }
    // eslint-disable-next-line
  }, [products]);
  useEffect(() => {
    if (statusCreate === 'successful') {
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
    // eslint-disable-next-line
  }, [statusCreate, dataCreates]);
  const renderImage = (params) => {
    const imageUrl = params.formattedValue; // URL của hình ảnh lấy từ params.value
    return (
      <img
        src={imageUrl}
        alt="Hình ảnh"
        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
      />
    );
  };
  const columns = [
    { field: 'name', headerName: 'Tên sản phẩm', width: 200 },
    {
      field: 'thumbnail',
      headerName: 'Hình ảnh',
      width: 100,
      valueFormatter: (params) => renderUrl(params, backEnd),
      renderCell: renderImage,
    },
    { field: 'slug', headerName: 'Slug', width: 100 },
    { field: 'parentId', headerName: 'Danh mục', width: 100 },
    { field: 'status', headerName: 'Trạng thái', width: 200 },
    {
      field: 'price',
      headerName: 'Giá',
      width: 100,
      valueFormatter: (params) => formatCurrency(params),
    },
    { field: 'description', headerName: 'Mô tả ngắn', width: 100 },
    { field: 'content', headerName: 'Mô tả', width: 100 },
    { field: 'height', headerName: 'Chiều dài', width: 200 },
    { field: 'weight', headerName: 'Cân nặng', width: 200 },
  ];
  const handleSave = () => {
    dispatch(createsProduct(JSON.stringify(data)));
  };
  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Xuất file Excel
          </Typography>
          <TextField
            value={page}
            onChange={(e) => setPage(e.target.value)}
            label="Số trang"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            label="Số lượng"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleExportProduct}>
              Xuất file
            </Button>

            <Button variant="contained" color="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Xử lý sản phẩm </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            color="inherit"
            tabIndex={-1}
            startIcon={<IconUpload />}
          >
            Tải lên file
            <VisuallyHiddenInput type="file" onChange={handleUploadFile} accept=".xlsx, .xls" />
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSave}
            startIcon={<IconSave />}
            disabled={data.length === 0}
          >
            Lưu
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleOpen}
            startIcon={<IconDownload />}
          >
            Xuất excel
          </Button>
        </Stack>
      </Stack>
      <Card>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            // loading={loading}
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
            getRowId={(row) => row.slug}
            localeText={{
              noRowsLabel: 'Không có dữ liệu',
              MuiTablePagination: {
                labelRowsPerPage: 'Số dòng mỗi trang',
              },
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10]}
            // checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Card>
    </Container>
  );
}
