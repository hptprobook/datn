
import react, { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import EditorContent from 'src/components/editor/editor';
import { Icon } from '@iconify/react';
import checkBoxOutlineBlank from '@iconify/icons-ic/baseline-check-box-outline-blank';
import checkBox from '@iconify/icons-ic/baseline-check-box';
import InfoBox from 'src/components/Box/InforBox';
import ImageDropZone from 'src/components/DropZoneUpload/DropZoneImage';

// ----------------------------------------------------------------------

const icon = <Icon icon={checkBoxOutlineBlank} />;
const checkedIcon = <Icon icon={checkBox} />;
export default function CreateProductPage() {
    const [imglist, setImglist] = useState([]);

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
        setImglist(value);
    }
    
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Tạo một sản phẩm mới</Typography>
            </Stack>
            <Box justifyContent="center">
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Details</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Tiêu đề, mô tả ngắn, hình ảnh...</Typography>
                    <form>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="productName"
                                label="Tên sản phẩm"
                                variant="outlined"
                                placeholder="Tên sản phẩm"
                            />
                        </Box>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="shortDescription"
                                label="Mô tả ngắn"
                                variant="outlined"
                                placeholder="Mô tả ngắn"
                                multiline
                                rows={4}
                            />
                        </Box>
                        <Box mb={4}>
                            <InputLabel htmlFor="Description">Mô tả</InputLabel>
                            <EditorContent />
                        </Box>
                        <Box mb={4}>
                        <InfoBox title="Hình ảnh">
                                <ImageDropZone handleUpload={handleChangeUploadImg} />
                        </InfoBox>
                        </Box>
                    </form>
                </Box>
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Thuộc tính</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Các chức năng và thuộc tính bổ sung...</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        {/* <Box>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="product-code">Product code</InputLabel>
                                    <TextField id="product-code" placeholder="Product code" variant="outlined" />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="product-sku">Product SKU</InputLabel>
                                    <TextField id="product-sku" placeholder="Product SKU" variant="outlined" />
                                </FormControl>
                            </Box> */}
                        <Box>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    id="quantity"
                                    type="number"
                                    label="Quantity"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <TextField fullWidth id="Stock" label="Stock" variant="outlined" />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="Brand" shrink>
                                    Brand
                                </InputLabel>
                                <Select id="Brand" defaultValue="" label="Brand">
                                    <MenuItem value="1">Yame</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="category" shrink>
                                    Category
                                </InputLabel>
                                <Select id="category" defaultValue="" label="Category">
                                    <MenuItem value="T-shirts">T-shirts</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
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
                                    style={{ width: 500 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Colors" placeholder="Colors" />
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
                                    style={{ width: 500 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Sizes" placeholder="Sizes" />
                                    )}
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
                                            label="Tags"
                                            placeholder="Tags"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    sx={{ width: '500px' }}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
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
                        Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Price related inputs
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 1, p: 2 }}>
                                <TextField
                                    fullWidth
                                    id="price"
                                    label="Regular price"
                                    variant="outlined"
                                    placeholder="0.00 VND"
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 1, p: 2 }}>
                                <TextField
                                    fullWidth
                                    id="sale-price"
                                    label="Sale price"
                                    variant="outlined"
                                    placeholder="0.00 VND"
                                />
                            </Box>
                        </Box>
                        {/* <FormControlLabel
                            control={<Checkbox id="tax-included" />}
                            label="Price includes taxes"
                            sx={{ color: 'text.secondary' }}
                        /> */}
                    </Box>
                </Box>
            </Box>
            <Box sx={{ maxWidth: 'lg', p: 6, color: 'text.primary', mt: 5 }}>
                <Button
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
                    Create product
                </Button>
            </Box>
        </Container>
    );
}
