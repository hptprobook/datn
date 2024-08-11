import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// ----------------------------------------------------------------------

export default function CreateUserPage() {
  const [role, setRole] = useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thêm người dùng mới</Typography>
      </Stack>

      <Card
        sx={{
          p: 3,
        }}
      >
        <Typography variant="h6" typography="p">
          Thêm người dùng mới
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 xs={12} md={8}>
            <TextField fullWidth label="Họ" />
          </Grid2>
          <Grid2 xs={12} md={4}>
            <TextField fullWidth label="Tên" />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <TextField fullWidth label="Điện thoại" />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <TextField fullWidth label="Email" />
          </Grid2>
          <Grid2 xs={12} md={8}>
            <TextField type="password" fullWidth label="Mật khẩu" />
          </Grid2>
          <Grid2 xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Vai trò</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Vai trò"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
      </Card>
    </Container>
  );
}
