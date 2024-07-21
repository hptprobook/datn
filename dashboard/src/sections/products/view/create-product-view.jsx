
import react , { useState } from 'react';

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
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';

// ----------------------------------------------------------------------

export default function CreateProductPage() {

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
    ];
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
                <InputLabel htmlFor="colors" shrink>
                  Colors
                </InputLabel>
                {/* <Autocomplete
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
                    <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                  )}
                /> */}
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel htmlFor="sizes" shrink>
                  Sizes
                </InputLabel>
                <Select id="sizes" defaultValue="" label="sizes">
                  {/* Add MenuItem components here */}
                </Select>
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
