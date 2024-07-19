import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';

// ----------------------------------------------------------------------

export default function CreateProductPage() {


    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Create a new product</Typography>
            </Stack>
            <Box justifyContent="center">
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Details</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Title, short description, image...</Typography>
                    <form>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="productName"
                                label="Product name"
                                variant="outlined"
                                placeholder="Product name"
                            />
                        </Box>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="shortDescription"
                                label="Short description"
                                variant="outlined"
                                placeholder="Short description"
                                multiline
                                rows={4}
                            />
                        </Box>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="Description"
                                label="description"
                                variant="outlined"
                                placeholder="description"
                                multiline
                                rows={4}
                            />
                        </Box>
                    </form>
                </Box>
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Properties</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Additional functions and attributes...</Typography>
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
                                <InputLabel htmlFor="category" shrink>Category</InputLabel>
                                <Select id="category" defaultValue=""
                                    label="Category"
                                >
                                    <MenuItem value="T-shirts">T-shirts</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="colors" shrink>Colors</InputLabel>
                                <Select id="colors" defaultValue=""
                                    label="colors"
                                >
                                    {/* Add MenuItem components here */}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="sizes" shrink>Sizes</InputLabel>
                                <Select id="sizes"
                                    defaultValue=""
                                    label="sizes"
                                >
                                    {/* Add MenuItem components here */}
                                </Select>

                            </FormControl>
                        </Box>
                        <Box sx={{ gridColumn: { md: 'span 2' } }}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    id="tags"
                                    label="Tags"
                                    placeholder="Tags"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Pricing</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Price related inputs</Typography>
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
