import * as React from 'react';
import Typography from '@mui/material/Typography';
import {
  Box,
  Modal,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
import { useFormik } from 'formik';
import { formatCurrency } from 'src/utils/format-number';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import Grid2 from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { renderUrl } from 'src/utils/check';
import FormHelpTextError from 'src/components/errors/form-error';
import {
  style,
  Accordion,
  sizeSchema,
  variantSchema,
  AccordionDetails,
  AccordionSummary,
} from './utils';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

export default function AdvancedVariant({
  onUpdate,
  dataWareHouse,
  defaultVariants,
  colors,
  sizes,
}) {
  const [expanded, setExpanded] = React.useState('panel1');
  const [variants, setVariants] = React.useState([...defaultVariants]);
  const [errorUpload, setErrorUpload] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(null);

  const [openSize, setOpenSize] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const formik = useFormik({
    initialValues: {
      price: '',
      marketPrice: '',
      capitalPrice: '',
      onlinePrice: '',
      saleOff: '',
      stock: '',
      sku: '',
      color: '',
      image: null,
      sizes: [],
      warehouseId: '',
      imageAdd: null,
    },
    validationSchema: variantSchema,
    onSubmit: (values) => {
      if (!values.image) {
        setErrorUpload('Vui lòng chọn ảnh');
        return;
      }
      setErrorUpload('');
      const newVariant = {
        price: values.price,
        marketPrice: values.marketPrice,
        capitalPrice: values.capitalPrice,
        onlinePrice: values.onlinePrice,
        saleOff: values.saleOff,
        stock: values.stock,
        sku: values.sku,
        color: values.color,
        image: values.image,
        sizes: [],
        imageAdd: values.imageAdd,
        warehouseId: values.warehouseId,
      };
      setVariants([...variants, newVariant]);
      formik.resetForm();
      handleClose();
    },
  });
  const formikUpdate = useFormik({
    initialValues: {
      price: '',
      marketPrice: '',
      capitalPrice: '',
      onlinePrice: '',
      saleOff: '',
      stock: '',
      sku: '',
      color: '',
      image: null,
      sizes: [],
      warehouseId: '',
      imageAdd: null,
    },
    enableReinitialize: true,
    validationSchema: variantSchema,
    onSubmit: (values) => {
      values.sizes = variants[openDetail].sizes;
      const newVariants = [...variants];
      newVariants[openDetail] = values;
      setVariants(newVariants);
      setOpenDetail(null);
    },
  });
  const formikSize = useFormik({
    initialValues: {
      size: '',
      stock: '',
      price: '',
      index: '',
      sale: 1,
      trading: 0,
      sku: '',
    },
    validationSchema: sizeSchema,
    onSubmit: (values) => {
      if (Number(values.price) < Number(variants[openSize].capitalPrice)) {
        formikSize.setFieldError('price', 'Giá phải lớn hơn giá vốn');
        return;
      }
      const exitingSize = variants[openSize].sizes.find((size) => size.size === values.size);
      if (exitingSize) {
        formikSize.setFieldError('size', 'Kích thước đã tồn tại');
        return;
      }
      const newVariant = structuredClone(variants); // Deep clone
      const newSize = [...newVariant[openSize].sizes];

      newSize.push({
        size: values.size,
        stock: values.stock,
        price: values.price,
        sale: values.sale,
        trading: values.trading,
        sku: newVariant[openSize].sku + values.size,
      });
      const newStock = newSize.reduce((acc, cur) => Number(acc) + Number(cur.stock), 0);
      newVariant[openSize].stock = newStock;
      newVariant[openSize].sizes = newSize;

      setVariants(newVariant);
      setOpenSize(null);
      formikSize.resetForm();
    },
  });
  const handleDeleteVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleChangeUpload = React.useCallback((files) => {
    if (files) {
      formik.setFieldValue('image', files);
      formik.setFieldValue('imageAdd', files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeUploadUpdate = React.useCallback((files) => {
    if (files) {
      formikUpdate.setFieldValue('image', files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDeleteSize = (i, index) => {
    const newVariants = JSON.parse(JSON.stringify(variants));
    newVariants[i].sizes.splice(index, 1);
    const newStock = newVariants[i].sizes.reduce((acc, cur) => Number(acc) + Number(cur.stock), 0);

    newVariants[i].stock = newStock || 1;

    setVariants(newVariants);
  };
  const handleSelectVariant = (index) => {
    const variant = variants[index];
    setOpenDetail(index);
    formikUpdate.setValues({
      price: variant.price,
      marketPrice: variant.marketPrice,
      capitalPrice: variant.capitalPrice,
      onlinePrice: variant.onlinePrice,
      saleOff: variant.saleOff,
      stock: variant.stock,
      sku: variant.sku,
      color: variant.color,
      image: variant.image,
      imageAdd: variant.image,
      warehouseId: variant.warehouseId,
    });
  };
  return (
    <Stack spacing={3}>
      <Typography variant="h6">Biến thể</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="space-between" mb={5}>
              <Typography variant="h6" id="modal-modal-title" align="left" gutterBottom>
                Thêm biến thể
              </Typography>
              <IconButton onClick={handleClose}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Stack>
            <Grid2 container spacing={3}>
              <Grid2 xs={6}>
                <Stack spacing={{ xs: 1, sm: 2 }}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-priceVariant">Giá</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-priceVariant"
                      type="text"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá"
                      error={formik.touched.price && Boolean(formik.errors.price)}
                    />
                    <FormHelperText
                      sx={{
                        color: 'red',
                      }}
                    >
                      {formik.touched.price && formik.errors.price ? formik.errors.price : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-marketPrice">Giá cửa hàng</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-marketPrice"
                      type="text"
                      name="marketPrice"
                      value={formik.values.marketPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá cửa hàng"
                      error={formik.touched.marketPrice && Boolean(formik.errors.marketPrice)}
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.marketPrice && formik.errors.marketPrice
                        ? formik.errors.marketPrice
                        : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-capitalPrice">Giá vốn</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-capitalPrice"
                      type="text"
                      name="capitalPrice"
                      value={formik.values.capitalPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá vốn"
                      error={formik.touched.capitalPrice && Boolean(formik.errors.capitalPrice)}
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.capitalPrice && formik.errors.capitalPrice
                        ? formik.errors.capitalPrice
                        : ''}
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-onlinePrice">Giá online</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-onlinePrice"
                      type="text"
                      name="onlinePrice"
                      value={formik.values.onlinePrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá online"
                      error={formik.touched.onlinePrice && Boolean(formik.errors.onlinePrice)}
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.onlinePrice && formik.errors.onlinePrice
                        ? formik.errors.onlinePrice
                        : ''}
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-saleOff">Giảm giá</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-saleOff"
                      type="text"
                      name="saleOff"
                      value={formik.values.saleOff}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giảm giá"
                      error={formik.touched.saleOff && Boolean(formik.errors.saleOff)}
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formik.touched.saleOff && formik.errors.saleOff ? formik.errors.saleOff : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="warehouseId-select-label">Kho</InputLabel>
                    <Select
                      labelId="warehouseId-select-label"
                      id="warehouseId-select"
                      value={formik.values.warehouseId}
                      error={formik.touched.warehouseId && Boolean(formik.errors.warehouseId)}
                      label="Kho"
                      name="warehouseId"
                      onChange={formik.handleChange}
                    >
                      {dataWareHouse.map((item, i) => (
                        <MenuItem
                          key={i}
                          value={item._id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelpTextError label={formik.errors.touched && formik.errors.warehouseId} />
                  </FormControl>
                </Stack>
              </Grid2>
              <Grid2 xs={6}>
                <ImageDropZone singleFile handleUpload={handleChangeUpload} />
                <FormHelperText sx={{ color: 'red' }}>{errorUpload}</FormHelperText>
                <Stack spacing={2} mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="color-select-label">Màu sắc</InputLabel>
                    <Select
                      labelId="color-select-label"
                      id="color-select"
                      value={formik.values.color}
                      error={formik.touched.color && Boolean(formik.errors.color)}
                      label="Màu sắc"
                      name="color"
                      onChange={formik.handleChange}
                    >
                      {colors.map((color, i) => (
                        <MenuItem
                          key={i}
                          value={color.value}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {color.name}
                          <span
                            style={{
                              display: 'inline-block',
                              width: 20,
                              height: 20,
                              backgroundColor: color.hex,
                              borderRadius: '50%',
                              marginLeft: 10,
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelpTextError label={formik.errors.touched && formik.errors.color} />
                  </FormControl>
                  <TextField
                    id="sku"
                    name="sku"
                    label="Mã SKU"
                    value={formik.values.sku}
                    onChange={formik.handleChange}
                    error={formik.touched.sku && Boolean(formik.errors.sku)}
                    helperText={formik.touched.sku && formik.errors.sku}
                  />
                  <TextField
                    id="stock"
                    name="stock"
                    label="Số lượng"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                    helperText={formik.touched.stock && formik.errors.stock}
                  />
                </Stack>
              </Grid2>
            </Grid2>
            <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="inherit">
                Thêm
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openDetail !== null}
        onClose={() => setOpenDetail(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formikUpdate.handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="space-between" mb={5}>
              <Typography variant="h6" id="modal-modal-title" align="left" gutterBottom>
                Sửa biến thể
              </Typography>
              <IconButton onClick={() => setOpenDetail(null)}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Stack>
            <Grid2 container spacing={3}>
              <Grid2 xs={6}>
                <Stack spacing={{ xs: 1, sm: 2 }}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-priceVariant">Giá</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-priceVariant"
                      type="text"
                      name="price"
                      value={formikUpdate.values.price}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá"
                      error={formikUpdate.touched.price && Boolean(formikUpdate.errors.price)}
                    />
                    <FormHelperText
                      sx={{
                        color: 'red',
                      }}
                    >
                      {formikUpdate.touched.price && formikUpdate.errors.price
                        ? formikUpdate.errors.price
                        : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-marketPrice">Giá cửa hàng</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-marketPrice"
                      type="text"
                      name="marketPrice"
                      value={formikUpdate.values.marketPrice}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá cửa hàng"
                      error={
                        formikUpdate.touched.marketPrice && Boolean(formikUpdate.errors.marketPrice)
                      }
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formikUpdate.touched.marketPrice && formikUpdate.errors.marketPrice
                        ? formikUpdate.errors.marketPrice
                        : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-capitalPrice">Giá vốn</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-capitalPrice"
                      type="text"
                      name="capitalPrice"
                      value={formikUpdate.values.capitalPrice}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá vốn"
                      error={
                        formikUpdate.touched.capitalPrice &&
                        Boolean(formikUpdate.errors.capitalPrice)
                      }
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formikUpdate.touched.capitalPrice && formikUpdate.errors.capitalPrice
                        ? formikUpdate.errors.capitalPrice
                        : ''}
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-onlinePrice">Giá online</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-onlinePrice"
                      type="text"
                      name="onlinePrice"
                      value={formikUpdate.values.onlinePrice}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giá online"
                      error={
                        formikUpdate.touched.onlinePrice && Boolean(formikUpdate.errors.onlinePrice)
                      }
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formikUpdate.touched.onlinePrice && formikUpdate.errors.onlinePrice
                        ? formikUpdate.errors.onlinePrice
                        : ''}
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-saleOff">Giảm giá</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-saleOff"
                      type="text"
                      name="saleOff"
                      value={formikUpdate.values.saleOff}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                      label="Giảm giá"
                      error={formikUpdate.touched.saleOff && Boolean(formikUpdate.errors.saleOff)}
                    />
                    <FormHelperText sx={{ color: 'red' }}>
                      {formikUpdate.touched.saleOff && formikUpdate.errors.saleOff
                        ? formikUpdate.errors.saleOff
                        : ''}
                    </FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="warehouseId-select-label">Kho</InputLabel>
                    <Select
                      labelId="warehouseId-select-label"
                      id="warehouseId-select"
                      value={formik.values.warehouseId}
                      error={formik.touched.warehouseId && Boolean(formik.errors.warehouseId)}
                      label="Kho"
                      name="warehouseId"
                      onChange={formik.handleChange}
                    >
                      {dataWareHouse.map((item, i) => (
                        <MenuItem
                          key={i}
                          value={item._id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelpTextError label={formik.errors.touched && formik.errors.warehouseId} />
                  </FormControl>
                </Stack>
              </Grid2>
              <Grid2 xs={6}>
                <ImageDropZone
                  singleFile
                  handleUpload={handleChangeUploadUpdate}
                  defaultImg={formikUpdate.values.image}
                />
                <FormHelperText sx={{ color: 'red' }}>{errorUpload}</FormHelperText>
                <Stack spacing={2} mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="color-select-label">Màu sắc</InputLabel>
                    <Select
                      labelId="color-select-label"
                      id="color-select"
                      value={formikUpdate.values.color}
                      error={formikUpdate.touched.color && Boolean(formikUpdate.errors.color)}
                      label="Màu sắc"
                      name="color"
                      onChange={formikUpdate.handleChange}
                    >
                      {colors.map((color, index) => (
                        <MenuItem
                          key={index}
                          value={color.value}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {color.name}
                          <span
                            style={{
                              display: 'inline-block',
                              width: 20,
                              height: 20,
                              backgroundColor: color.hex,
                              borderRadius: '50%',
                              marginLeft: 10,
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelpTextError
                      label={formikUpdate.errors.touched && formikUpdate.errors.color}
                    />
                  </FormControl>
                  <TextField
                    id="sku"
                    name="sku"
                    label="Mã SKU"
                    value={formikUpdate.values.sku}
                    onChange={formikUpdate.handleChange}
                    error={formikUpdate.touched.sku && Boolean(formikUpdate.errors.sku)}
                    helperText={formikUpdate.touched.sku && formikUpdate.errors.sku}
                  />
                  <TextField
                    id="stock"
                    name="stock"
                    label="Số lượng"
                    value={formikUpdate.values.stock}
                    onChange={formikUpdate.handleChange}
                    error={formikUpdate.touched.stock && Boolean(formikUpdate.errors.stock)}
                    helperText={formikUpdate.touched.stock && formikUpdate.errors.stock}
                  />
                </Stack>
              </Grid2>
            </Grid2>
            <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
              <Button variant="outline" onClick={() => setOpenDetail(null)}>
                Hủy
              </Button>
              <Button variant="contained" color="inherit" type="submit">
                Lưu
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openSize !== null}
        onClose={() => setOpenSize(null)}
        aria-labelledby="modal-size-title"
        aria-describedby="modal-size-description"
      >
        <Box sx={style}>
          <form onSubmit={formikSize.handleSubmit}>
            <Stack spacing={2} direction="column">
              <Typography fontWeight={600}>Thêm kích thước</Typography>

              <FormControl fullWidth>
                <InputLabel id="size-select-label">Kích thước</InputLabel>
                <Select
                  labelId="size-select-label"
                  id="size-select"
                  value={formikSize.values.size}
                  error={formikSize.touched.size && Boolean(formikSize.errors.size)}
                  label="Kích thước"
                  name="size"
                  onChange={formikSize.handleChange}
                >
                  {sizes.map((size, index) => (
                    <MenuItem key={index} value={size.name}>
                      {size.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  sx={{
                    color: formikSize.touched.size && formikSize.errors.size ? 'red' : 'inherit',
                  }}
                >
                  {formikSize.touched.size && formikSize.errors.size ? formikSize.errors.size : ''}
                </FormHelperText>
              </FormControl>
              <TextField
                id="stock"
                name="stock"
                label="Số lượng"
                value={formikSize.values.stock}
                onChange={formikSize.handleChange}
                error={formikSize.touched.stock && Boolean(formikSize.errors.stock)}
                helperText={formikSize.touched.stock && formikSize.errors.stock}
              />
              <TextField
                id="price"
                name="price"
                label="Giá"
                value={formikSize.values.price}
                onChange={formikSize.handleChange}
                error={formikSize.touched.price && Boolean(formikSize.errors.price)}
                helperText={formikSize.touched.price && formikSize.errors.price}
              />
              <TextField
                name="sale"
                label="Có thể bán"
                value={formikSize.values.sale}
                onChange={formikSize.handleChange}
                error={formikSize.touched.sale && Boolean(formikSize.errors.sale)}
                helperText={formikSize.touched.sale && formikSize.errors.sale}
              />
              <TextField
                name="trading"
                label="Đang giao dịch"
                value={formikSize.values.trading}
                onChange={formikSize.handleChange}
                error={formikSize.touched.trading && Boolean(formikSize.errors.trading)}
                helperText={formikSize.touched.trading && formikSize.errors.trading}
              />
              <Button type="submit" variant="contained" color="inherit">
                Thêm
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Box>
        {variants.map((variant, index) => (
          <Accordion
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
            key={index}
          >
            <AccordionSummary
              aria-controls={`panel${index + 1}d-content`}
              id={`panel${index + 1}d-header`}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Stack spacing={2}>
                  <Typography>
                    Mã SKU: {variant.sku} - Màu sắc: {variant.color}
                  </Typography>
                </Stack>
                {variant.image instanceof File ? (
                  <img
                    style={{ height: '50px', width: '50px' }}
                    src={URL.createObjectURL(variant.image)}
                    alt="Preview"
                  />
                ) : (
                  <img
                    style={{ height: '50px', width: '50px' }}
                    src={renderUrl(variant.image, backendUrl)}
                    alt="Preview"
                  />
                )}

                <Box>
                  <IconButton sx={{ display: 'flex' }} onClick={() => handleDeleteVariant(index)}>
                    <Iconify icon="eva:trash-2-fill" />
                  </IconButton>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography>
                  Số lượng: {variant.stock} - Giá: {formatCurrency(variant.price)} - Kho:{' '}
                  {variant.warehouseId}
                </Typography>
                <Typography>
                  Giá cửa hàng: {formatCurrency(variant.marketPrice)} - Giá online:{' '}
                  {formatCurrency(variant.onlinePrice)} - Giá vốn:{' '}
                  {formatCurrency(variant.capitalPrice)}
                </Typography>
                {variant.sizes.length > 0 &&
                  variant.sizes.map((size, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        borderTop: '1px solid #e0e0e0',
                      }}
                    >
                      <Typography>
                        Kích thước: {size.size} - Số lượng: {size.stock} - Giá:{' '}
                        {formatCurrency(size.price)} - SKU: {size.sku}
                      </Typography>
                      <IconButton onClick={() => handleDeleteSize(index, i)}>
                        <Iconify icon="eva:close-fill" />
                      </IconButton>
                    </Stack>
                  ))}

                <Stack spacing={2} direction="row" mt={2} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => handleSelectVariant(index)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setOpenSize(index)}>
                    Thêm kích thước
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="inherit" onClick={handleOpen}>
          Thêm biến thể
        </Button>
        <Button variant="contained" color="inherit" onClick={() => onUpdate(variants)}>
          Lưu
        </Button>
      </Stack>
    </Stack>
  );
}
AdvancedVariant.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  defaultVariants: PropTypes.array,
  colors: PropTypes.array,
  sizes: PropTypes.array,
  dataWareHouse: PropTypes.array,
};
