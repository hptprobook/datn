/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import './styles.css';
import { lazy, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from 'src/redux/slices/productSlice';

// ----------------------------------------------------------------------

export default function ExportProductPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch]);
  const flattenData = (data) => {
    const rows = [];
    data.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.sizes.forEach((size) => {
          rows.push({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            brand: product.brand,
            inventory: product.inventory,
            variantPrice: variant.price,
            variantColor: variant.color,
            variantStock: variant.stock,
            size: size.size,
            sizePrice: size.price,
            sizeStock: size.stock,
            // seoTitle: product.seoOption.title,
            // seoAlias: product.seoOption.alias,
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
      let product = restoredData.find((p) => p.name === item.name);
      if (!product) {
        // Nếu chưa, thêm sản phẩm mới
        product = {
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          brand: item.brand,
          inventory: item.inventory,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
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
          price: item.variantPrice,
          color: item.variantColor,
          stock: item.variantStock,
          sizes: [],
        };
        product.variants.push(variant);
      }
  
      // Thêm kích thước vào biến thể
      variant.sizes.push({
        size: item.size,
        price: item.sizePrice,
        stock: item.sizeStock,
      });
    });
    
    return restoredData;
  };
  
  useEffect(() => {
    console.log(products);
    if (products?.products?.length > 0) {
      console.log(flattenData(products.products));
      console.log(restoreData(flattenData(products.products)));
    }
  }, [products]);
  const exportToExcel = (data, filename = 'data.xlsx') => {
    // Xử lý JSON để "flatten" object/mảng (gỡ các nested structure)

    // Tạo một worksheet từ dữ liệu đã "flatten"
    const worksheet = XLSX.utils.json_to_sheet(flattenData);

    // Tạo một workbook và gán worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Xuất file Excel
    XLSX.writeFile(workbook, filename);
  };
  const handleExportProduct = () => {
    exportToExcel(products, 'products.xlsx');
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Xử lý sản phẩm </Typography>
        {/* <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export excel
        </Button> */}
      </Stack>
    </Container>
  );
}
