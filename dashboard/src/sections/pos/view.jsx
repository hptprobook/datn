import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import {
  Box,
  Tab,
  Tabs,
  Input,
  IconButton,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function PosPage() {
  const route = useRouter();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={4} mb={5}>
        <FormControl variant="standard">
          <InputLabel htmlFor="search-input-product">Tìm kiếm sản phẩm</InputLabel>
          <Input
            id="search-input-product"
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            }
          />
        </FormControl>
        <IconButton onClick={() => route.push('/pos/create')} variant="contained" color="primary">
          <Iconify icon="eva:plus-fill" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
            <Tab label="Item Four" />
            <Tab label="Item Five" />
            <Tab label="Item Six" />
            <Tab label="Item Seven" />
          </Tabs>
        </Box>
      </Stack>

      <Card>Hello</Card>
    </Box>
  );
}
