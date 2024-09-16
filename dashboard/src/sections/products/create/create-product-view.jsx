/* eslint-disable react/prop-types */


import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    Box,
    Grid,
    Button,
    Select,
    Checkbox,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    Autocomplete,
    FormHelperText,
} from '@mui/material';
import { Form, Field, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import EditorContent from 'src/components/editor/editor';
import { Icon } from '@iconify/react';
import checkBoxOutlineBlank from '@iconify/icons-ic/baseline-check-box-outline-blank';
import checkBox from '@iconify/icons-ic/baseline-check-box';
import InfoBox from 'src/components/Box/InforBox';
import ImageDropZone from 'src/components/DropZoneUpload/DropZoneImage';
import './styles.css'; 


// ----------------------------------------------------------------------

const icon = <Icon icon={checkBoxOutlineBlank} />;
const checkedIcon = <Icon icon={checkBox} />;
// Define validation schema
const validationSchema = Yup.object({
    productName: Yup.string().required('Tên sản phẩm là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    shortDescription: Yup.string().required('Mô tả ngắn là bắt buộc'),
    quantity: Yup.number().required('Số lượng là bắt buộc').min(1, 'Số lượng phải ít nhất là 1'),
    stock: Yup.number().required('Stock is required').min(0, 'Stock must be greater than or equal to 0'),
    price: Yup.number().required('Cần nhập có giá thông thường').min(0, 'Giá không được âm'),
    salePrice: Yup.number().min(0, 'Giá khuyến mãi không được âm'),
  });
export default function CreateProductPage() {
    // const [imglist, setImglist] = useState([]);

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
        { title: '12 Angry Men', year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: 'Pulp Fiction', year: 1994 },
        {
            title: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { title: 'The Good, the Bad and the Ugly', year: 1966 },
        { title: 'Fight Club', year: 1999 },
        {
            title: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            title: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { title: 'Forrest Gump', year: 1994 },
        { title: 'Inception', year: 2010 },
        {
            title: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { title: 'Goodfellas', year: 1990 },
        { title: 'The Matrix', year: 1999 },
        { title: 'Seven Samurai', year: 1954 },
        {
            title: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { title: 'City of God', year: 2002 },
        { title: 'Se7en', year: 1995 },
        { title: 'The Silence of the Lambs', year: 1991 },
        { title: "It's a Wonderful Life", year: 1946 },
        { title: 'Life Is Beautiful', year: 1997 },
        { title: 'The Usual Suspects', year: 1995 },
        { title: 'Léon: The Professional', year: 1994 },
        { title: 'Spirited Away', year: 2001 },
        { title: 'Saving Private Ryan', year: 1998 },
        { title: 'Once Upon a Time in the West', year: 1968 },
        { title: 'American History X', year: 1998 },
        { title: 'Interstellar', year: 2014 },
    ];

    const colors = [
        { title: 'Đỏ' },
        { title: 'Xanh dương' },
        { title: 'Vàng' },
        { title: 'Xanh lá' },
        { title: 'Đen' },
        { title: 'Trắng' },
        { title: 'Cam' },
        { title: 'Tím' },
        { title: 'Hồng' },
        { title: 'Nâu' },
        { title: 'Xám' },
    ]
    const Sizes = [
        { title: '7' },
        { title: '8' },
        { title: '8.5' },
        { title: '9' },
        { title: '9.5' },
        { title: '10' },
        { title: '10.5' },
        { title: '11' },
        { title: '11.5' },
        { title: '12' },
        { title: '13' },
    ]

    const handleChangeUploadImg = (value) => {
        // setImglist(value);
    }

    return (
        <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Tạo một sản phẩm mới</Typography>
        </Stack>
        <Formik
          initialValues={{
            productName: '',
            description: '',
            shortDescription: '',
            quantity: '',
            SKU: '',
            price: '',
            salePrice: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form>
              <Grid >
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Details</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Tiêu đề, hình ảnh...</Typography>
                    <Box mb={4}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="productName"
                        name="productName"
                        label="Tên sản phẩm"
                        variant="outlined"
                        placeholder="Tên sản phẩm"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.productName}
                        helperText={<ErrorMessage name="productName" component="div" className="error-message"/>}
                      />
                    </Box>
                    <Box mb={4}>
                        <FormControl fullWidth>
                          <Field
                            as={TextField}
                            fullWidth
                            id="quantity"
                            name="quantity"
                            type="number"
                            label="Số lượng"
                            variant="outlined"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.quantity}
                            helperText={<ErrorMessage name="quantity" component="div" className="error-message" />}
                          />
                        </FormControl>
                      </Box>
                      <Box mb={4}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-helper-label">Thương hiệu</InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="Brand"
                            label="Thương hiệu"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    <Box mb={4}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-helper-label">Danh mục</InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="Category"
                            label="Danh mục"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box mb={4}>
                        <FormControl fullWidth>
                          <Field
                            as={TextField}
                            fullWidth
                            id="SKU"
                            name="SKU"
                            label="SKU"
                            variant="outlined"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.stock}
                            helperText={<ErrorMessage name="SKU" component="div" className="error-message" />}
                          />
                        </FormControl>
                      </Box>
                      <Box sx={{ gridColumn: { md: 'span 2' } }}>
                        <FormControl fullWidth>
                          <Autocomplete
                            fullWidth
                            multiple
                            id="tags"
                            options={top100Films}
                            getOptionLabel={(option) => option.title}
                            defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Nhãn sản phẩm"
                                placeholder="Nhãn sản phẩm"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                        </FormControl>
                      </Box>
                    <Box mb={4}>
                      <InfoBox title="Hình ảnh">
                        <ImageDropZone handleUpload={handleChangeUploadImg} />
                      </InfoBox>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Thuộc tính</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Các chức năng và thuộc tính bổ sung...</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                     
                      <Box>
                        <FormControl fullWidth>
                          <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={colors}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, { selected }) => {
                              const { key, ...optionProps } = props;
                              return (
                                <li key={key} {...optionProps}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.title}
                                </li>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Màu sắc" placeholder="Màu sắc" />
                            )}
                          />
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl fullWidth>
                          <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={Sizes}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, { selected }) => {
                              const { key, ...optionProps } = props;
                              return (
                                <li key={key} {...optionProps}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.title}
                                </li>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Kích thước" placeholder="Kích thước" />
                            )}
                          />
                        </FormControl>
                      </Box>
                   
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      maxWidth: 'lg',
                      p: 6,
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      borderRadius: 2,
                      boxShadow: 3,
                      mt: 5,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                    Định giá
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                    Đầu vào liên quan đến giá
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box >
                          <Field
                            as={TextField}
                            fullWidth
                            id="price"
                            name="price"
                            label="Giá thông thường"
                            variant="outlined"
                            placeholder="0.00 VND"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.price}
                            helperText={<ErrorMessage name="price" component="div" className="error-message" />}
                          />
                        </Box>
                        {/* <Box>
                          <Field
                            as={TextField}
                            fullWidth
                            id="salePrice"
                            name="salePrice"
                            label="Giá khuyến mãi"
                            variant="outlined"
                            placeholder="0.00 VND"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.salePrice}
                            helperText={<ErrorMessage name="salePrice" component="div" className="error-message" />}
                          />
                        </Box> */}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Details</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Mô tả...</Typography>
                    <Box mb={4}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="shortDescription"
                        name="shortDescription"
                        label="Mô tả ngắn"
                        variant="outlined"
                        placeholder="Mô tả ngắn"
                        multiline
                        rows={4}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.shortDescription}
                        helperText={<ErrorMessage name="shortDescription" component="div" className="error-message" />}
                      />
                    </Box>
                    <Box mb={4}>
                      <InputLabel htmlFor="Description">Mô tả</InputLabel>
                      <Field name="description">
                      {({ field, form }) => (
                        <EditorContent
                          {...field}
                          value={field.value}
                          onChange={(content) => {
                            form.setFieldValue(field.name, content);
                          }}
                        />
                      )}
                    </Field>
                    <FormHelperText>
                      <ErrorMessage name="description" component="div" className="error-message" />
                    </FormHelperText>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ maxWidth: 'lg', p: 6, color: 'text.primary', mt: 5 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: '#1C252E',
                        color: 'foreground-foreground',
                        py: 2,
                        px: 4,
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#1C252E',
                          opacity: 0.8,
                        },
                      }}
                    >
                      Tạo sản phẩm
                    </Button>
                  </Box>
                </Grid>
                
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    );
}
