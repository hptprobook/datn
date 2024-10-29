import { styled } from '@mui/material/styles';
import {
  Paper,
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import * as XLSX from 'xlsx';
import Iconify from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, fetchAllVariants, createManyVariants } from 'src/redux/slices/variantSlices';

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
export default function VariantsImportPage() {
  const validateKey = ['name', 'type', 'value', "_id"];
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.variants.statusCreateMany);
  const dataCreateMany = useSelector((state) => state.variants.dataCreateMany);
  const variants = useSelector((state) => state.variants.variants);

  useEffect(() => {
    if (status === 'successful') {
      setData([]);
      dataCreateMany.successfulVariants.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreateMany',
          value: 'idle',
        })
      );
    }
    if (status === 'failed') {
      handleToast('error', dataCreateMany.message || 'Thêm biến thể thất bại');
      dataCreateMany.errors.forEach((item) => {
        handleToast('error', `${item.name}: ${item.message}`);
      });
      setData([]);
      dataCreateMany.successfulVariants.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreateMany',
          value: 'idle',
        })
      );
    }
  }, [status, dataCreateMany, dispatch]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON format
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      const keys = Object.keys(sheetData[0]);
      setData(sheetData);

      keys.forEach((key) => {
        if (!validateKey.includes(key)) {
          handleToast('error', 'Các cột trong file excel không đúng định dạng');
          setData([]);
        }
      });
    };

    reader.readAsBinaryString(file);
  };
  const handleSave = () => {
    if (data.length === 0) {
      handleToast('error', 'Không có dữ liệu để lưu');
      return;
    }
    const isValid = data.every((item) => {
      if (item.type === 'color' || item.type === 'size') {
        if (item.value.length === 0 || item.value.length > 10) {
          handleToast('error', 'Giá trị phải từ 1 - 10 kí tự');
          return false;
        }
        return true;
      }
      handleToast('error', 'Loại biến thể không hợp lệ');
      return false;
    });

    if (isValid) {
      data.forEach((item) => {
        item.value = item.value.toString();
      });
      dispatch(createManyVariants(data));
    } else {
      setData([]);
    }
  };

  const handleExcel = (d) => {
    const cleanedData = d.map(({ createdAt, updatedAt, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    // Tạo workbook và thêm worksheet vào workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Xuất file Excel
    XLSX.writeFile(workbook, 'variant.xlsx');
  };
  const handleExportExcel = () => {
    if(variants.length === 0) {
      dispatch(fetchAllVariants()).then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          handleExcel(res.payload);
        }
      });
      return;
    }
    handleExcel(variants);
  }

  return (
    <Container>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={4}>
          <Card
            sx={{
              p: 3,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5">Nhập dữ liệu từ Excel</Typography>

              <Button
                component="label"
                role={undefined}
                variant="contained"
                color="inherit"
                tabIndex={-1}
                startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
              >
                Tải lên file
                <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleExportExcel}
                startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
              >
                Xuất excel cho cập nhật
              </Button>
              <a href="/template.xlsx" download="template.xlsx">
                Tải file Excel mẫu
              </a>
            </Stack>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={8}>
          <Card
            sx={{
              p: 2,
            }}
          >
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Typography variant="h5">Xem trước dữ liệu</Typography>
              <IconButton onClick={handleSave}>
                <Iconify icon="eva:save-fill" />
              </IconButton>
            </Stack>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Giá trị</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>Không có dữ liệu</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
