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
  FormControl,
  FormHelperText,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { formatCurrency } from 'src/utils/format-number';

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

export default function CreateVariant() {
  const [expanded, setExpanded] = React.useState('panel1');
  const [variants, setVariants] = React.useState([]);
  const [open, setOpen] = React.useState(false);
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
      sizes: [],
    },
    validationSchema: variantSchema,
    onSubmit: (values) => {
      const newVariant = {
        price: values.price,
        marketPrice: values.marketPrice,
        capitalPrice: values.capitalPrice,
        onlinePrice: values.onlinePrice,
        saleOff: values.saleOff,
        stock: values.stock,
        sku: values.sku,
        color: values.color,
        sizes: [],
      };
      setVariants([...variants, newVariant]);
      formik.resetForm();
      handleClose();
    },
  });
  const handleDeleteVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };
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
            <Typography variant="h6" id="modal-modal-title" align="left" gutterBottom>
              Thêm biến thể
            </Typography>
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
              <TextField
                id="price"
                name="price"
                label="Giá"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField
                id="marketPrice"
                name="marketPrice"
                label="Giá cửa hàng"
                value={formik.values.marketPrice}
                onChange={formik.handleChange}
                error={formik.touched.marketPrice && Boolean(formik.errors.marketPrice)}
                helperText={formik.touched.marketPrice && formik.errors.marketPrice}
              />
              <TextField
                id="capitalPrice"
                name="capitalPrice"
                label="Giá vốn"
                value={formik.values.capitalPrice}
                onChange={formik.handleChange}
                error={formik.touched.capitalPrice && Boolean(formik.errors.capitalPrice)}
                helperText={formik.touched.capitalPrice && formik.errors.capitalPrice}
              />
              <TextField
                id="onlinePrice"
                name="onlinePrice"
                label="Giá online"
                value={formik.values.onlinePrice}
                onChange={formik.handleChange}
                error={formik.touched.onlinePrice && Boolean(formik.errors.onlinePrice)}
                helperText={formik.touched.onlinePrice && formik.errors.onlinePrice}
              />
              <TextField
                id="saleOff"
                name="saleOff"
                label="Giá giảm"
                value={formik.values.saleOff}
                onChange={formik.handleChange}
                error={formik.touched.saleOff && Boolean(formik.errors.saleOff)}
                helperText={formik.touched.saleOff && formik.errors.saleOff}
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
              <TextField
                id="sku"
                name="sku"
                label="Mã SKU"
                value={formik.values.sku}
                onChange={formik.handleChange}
                error={formik.touched.sku && Boolean(formik.errors.sku)}
                helperText={formik.touched.sku && formik.errors.sku}
              />
              <FormControl>
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
            </Stack>
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
                <Box>
                  <IconButton sx={{ display: 'flex' }} onClick={() => handleDeleteVariant(index)}>
                    <Iconify icon="eva:trash-2-fill" />
                  </IconButton>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Giá cửa hàng: {formatCurrency(variant.marketPrice)} - Giá online:{' '}
                {formatCurrency(variant.onlinePrice)} - Giá vốn:{' '}
                {formatCurrency(variant.capitalPrice)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}
