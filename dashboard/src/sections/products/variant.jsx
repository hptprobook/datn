import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { formatCurrency } from 'src/utils/format-number';
import ImageDropZone from 'src/components/drop-zone-upload/upload-img';
import Grid2 from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<Iconify icon="eva:arrow-ios-upward-fill" sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxWidth: 'calc(100% - 24px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const variantSchema = Yup.object().shape({
  price: Yup.number()
    .required('Giá không được để trống')
    .min(0, 'Giá không được âm')
    .max(1000000000, 'Giá không được quá 1 tỷ')
    .typeError('Giá phải là số'),
  marketPrice: Yup.number()
    .required('Giá cửa hàng không được để trống')
    .min(0, 'Giá cửa hàng không được âm')
    .max(1000000000, 'Giá cửa hàng không được quá 1 tỷ')
    .typeError('Giá cửa hàng phải là số'),
  capitalPrice: Yup.number()
    .required('Giá vốn không được để trống')
    .min(0, 'Giá vốn không được âm')
    .max(1000000000, 'Giá vốn không được quá 1 tỷ')
    .typeError('Giá vốn phải là số'),
  onlinePrice: Yup.number()
    .required('Giá online không được để trống')
    .min(0, 'Giá online không được âm')
    .max(1000000000, 'Giá online không được quá 1 tỷ')
    .typeError('Giá online phải là số'),
  saleOff: Yup.number()
    .min(0, 'Giá giảm không được âm')
    .max(1000000000, 'Giá giảm không được quá 1 tỷ')
    .typeError('Giá giảm phải là số'),
  stock: Yup.number()
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được âm')
    .max(1000000000, 'Số lượng không được quá 1 tỷ')
    .typeError('Số lượng phải là số'),
  sku: Yup.string()
    .required('Mã SKU không được để trống')
    .min(1, 'Mã SKU không được để trống')
    .max(255, 'Mã SKU không được quá 255 ký tự'),
  color: Yup.string()
    .required('Màu sắc không được để trống')
    .min(1, 'Màu sắc không được để trống')
    .max(255, 'Màu sắc không được quá 255 ký tự'),
});
const sizeSchema = Yup.object().shape({
  size: Yup.string()
    .required('Kích thước không được để trống')
    .min(1, 'Kích thước không được để trống')
    .max(255, 'Kích thước không được quá 255 ký tự'),
  stock: Yup.number()
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được âm')
    .max(1000000000, 'Số lượng không được quá 1 tỷ')
    .typeError('Số lượng phải là số'),
  price: Yup.number()
    .required('Giá không được để trống')
    .min(0, 'Giá không được âm')
    .max(1000000000, 'Giá không được quá 1 tỷ')
    .typeError('Giá phải là số'),
});
const colorsWithHex = [
  { name: 'Đỏ', hex: '#FF0000' },
  { name: 'Xanh lá cây', hex: '#00FF00' },
  { name: 'Xanh dương', hex: '#0000FF' },
  { name: 'Vàng', hex: '#FFFF00' },
  { name: 'Cam', hex: '#FFA500' },
  { name: 'Tím', hex: '#800080' },
  { name: 'Hồng', hex: '#FFC0CB' },
  { name: 'Đen', hex: '#000000' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Xám', hex: '#808080' },
  { name: 'Nâu', hex: '#A52A2A' },
  { name: 'Xanh lơ', hex: '#00FFFF' },
  { name: 'Hồng cánh sen', hex: '#FF00FF' },
  { name: 'Xanh lá nhạt', hex: '#00FF00' },
  { name: 'Xanh đậm', hex: '#4B0082' },
  { name: 'Tím nhạt', hex: '#EE82EE' },
];
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function CreateVariant({ onUpdate }) {
  const [expanded, setExpanded] = React.useState('panel1');
  const [variants, setVariants] = React.useState([]);
  const [errorUpload, setErrorUpload] = React.useState('');
  const [open, setOpen] = React.useState(false);
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
      };
      setVariants([...variants, newVariant]);
      formik.resetForm();
      handleClose();
    },
  });
  const formikSize = useFormik({
    initialValues: {
      size: '',
      stock: '',
      price: '',
      index: '',
    },
    validationSchema: sizeSchema,
    onSubmit: (values) => {
      const newVariant = [...variants];
      newVariant[openSize].sizes.push({
        size: values.size,
        stock: values.stock,
        price: values.price,
      });
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
      setErrorUpload('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    onUpdate(variants);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  return (
    <Stack spacing={3}>
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
                      {colorsWithHex.map((color, index) => (
                        <MenuItem
                          key={index}
                          value={color.name}
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
                    <FormHelperText
                      sx={{
                        color: formik.touched.color && formik.errors.color ? 'red' : 'inherit',
                      }}
                    >
                      {formik.touched.color && formik.errors.color ? formik.errors.color : ''}
                    </FormHelperText>
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
        open={openSize !== null}
        onClose={() => setOpenSize(null)}
        aria-labelledby="modal-size-title"
        aria-describedby="modal-size-description"
      >
        <Box sx={style}>
          <form onSubmit={formikSize.handleSubmit}>
            <Typography fontWeight={600}>Thêm kích thước</Typography>
            <Stack spacing={2} direction="row" mt={2} justifyContent="flex-end">
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
                  {clothingSizes.map((size, index) => (
                    <MenuItem key={index} value={size}>
                      {size}
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
              <Button type="submit" variant="contained" color="inherit">
                Thêm
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Button variant="contained" color="inherit" onClick={handleOpen}>
        Thêm biến thể
      </Button>
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
                  <Typography>
                    Số lượng: {variant.stock} - Giá: {formatCurrency(variant.price)}
                  </Typography>
                </Stack>
                <img
                  style={{ height: '50px', width: '50px' }}
                  src={URL.createObjectURL(variant.image)}
                  alt="Preview"
                />
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
                  Giá cửa hàng: {formatCurrency(variant.marketPrice)} - Giá online:{' '}
                  {formatCurrency(variant.onlinePrice)} - Giá vốn:{' '}
                  {formatCurrency(variant.capitalPrice)}
                </Typography>
                {variant.sizes.length > 0 &&
                  variant.sizes.map((size, i) => (
                    <Typography key={i}>
                      Kích thước: {size.size} - Số lượng: {size.stock} - Giá:{' '}
                      {formatCurrency(size.price)}
                    </Typography>
                  ))}

                <Button variant="contained" color="inherit" onClick={() => setOpenSize(index)}>
                  Thêm kích thước
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}
CreateVariant.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};
