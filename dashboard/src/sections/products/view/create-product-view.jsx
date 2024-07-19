import { useState } from 'react';

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
    TextField
} from '@mui/material';

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
        { title: 'Casablanca', year: 1942 },
        { title: 'City Lights', year: 1931 },
        { title: 'Psycho', year: 1960 },
        { title: 'The Green Mile', year: 1999 },
        { title: 'The Intouchables', year: 2011 },
        { title: 'Modern Times', year: 1936 },
        { title: 'Raiders of the Lost Ark', year: 1981 },
        { title: 'Rear Window', year: 1954 },
        { title: 'The Pianist', year: 2002 },
        { title: 'The Departed', year: 2006 },
        { title: 'Terminator 2: Judgment Day', year: 1991 },
        { title: 'Back to the Future', year: 1985 },
        { title: 'Whiplash', year: 2014 },
        { title: 'Gladiator', year: 2000 },
        { title: 'Memento', year: 2000 },
        { title: 'The Prestige', year: 2006 },
        { title: 'The Lion King', year: 1994 },
        { title: 'Apocalypse Now', year: 1979 },
        { title: 'Alien', year: 1979 },
        { title: 'Sunset Boulevard', year: 1950 },
        {
            title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { title: 'The Great Dictator', year: 1940 },
        { title: 'Cinema Paradiso', year: 1988 },
        { title: 'The Lives of Others', year: 2006 },
        { title: 'Grave of the Fireflies', year: 1988 },
        { title: 'Paths of Glory', year: 1957 },
        { title: 'Django Unchained', year: 2012 },
        { title: 'The Shining', year: 1980 },
        { title: 'WALL·E', year: 2008 },
        { title: 'American Beauty', year: 1999 },
        { title: 'The Dark Knight Rises', year: 2012 },
        { title: 'Princess Mononoke', year: 1997 },
        { title: 'Aliens', year: 1986 },
        { title: 'Oldboy', year: 2003 },
        { title: 'Once Upon a Time in America', year: 1984 },
        { title: 'Witness for the Prosecution', year: 1957 },
        { title: 'Das Boot', year: 1981 },
        { title: 'Citizen Kane', year: 1941 },
        { title: 'North by Northwest', year: 1959 },
        { title: 'Vertigo', year: 1958 },
        {
            title: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { title: 'Reservoir Dogs', year: 1992 },
        { title: 'Braveheart', year: 1995 },
        { title: 'M', year: 1931 },
        { title: 'Requiem for a Dream', year: 2000 },
        { title: 'Amélie', year: 2001 },
        { title: 'A Clockwork Orange', year: 1971 },
        { title: 'Like Stars on Earth', year: 2007 },
        { title: 'Taxi Driver', year: 1976 },
        { title: 'Lawrence of Arabia', year: 1962 },
        { title: 'Double Indemnity', year: 1944 },
        {
            title: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { title: 'Amadeus', year: 1984 },
        { title: 'To Kill a Mockingbird', year: 1962 },
        { title: 'Toy Story 3', year: 2010 },
        { title: 'Logan', year: 2017 },
        { title: 'Full Metal Jacket', year: 1987 },
        { title: 'Dangal', year: 2016 },
        { title: 'The Sting', year: 1973 },
        { title: '2001: A Space Odyssey', year: 1968 },
        { title: "Singin' in the Rain", year: 1952 },
        { title: 'Toy Story', year: 1995 },
        { title: 'Bicycle Thieves', year: 1948 },
        { title: 'The Kid', year: 1921 },
        { title: 'Inglourious Basterds', year: 2009 },
        { title: 'Snatch', year: 2000 },
        { title: '3 Idiots', year: 2009 },
        { title: 'Monty Python and the Holy Grail', year: 1975 },
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
                                <TextField
                                    fullWidth
                                    id="Stock"
                                    label="Stock"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="Brand" shrink>Brand</InputLabel>
                                <Select id="Brand" defaultValue=""
                                    label="Brand"
                                >
                                    <MenuItem value="1">Yame</MenuItem>
                                </Select>
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
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="tags"
                                    options={top100Films}
                                    getOptionLabel={(option) => option.title}
                                    defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Tags" placeholder="Tags" variant="outlined" fullWidth />
                                    )}
                                    sx={{ width: '500px' }}
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
