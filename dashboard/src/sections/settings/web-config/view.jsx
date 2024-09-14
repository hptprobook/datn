import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function WebConfigPage() {
  const route = useRouter();

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin trang web</Typography>

        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
          Thêm người dùng
        </Button> */}
      </Stack>

      <Card
        sx={{
          p: 3,
        }}
      >
        <Grid2 spacing={2} container>
          <Grid2 xs={12} sx={{ display: 'flex', gap: 1 }}>
            <TextField sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="inherit">
              Lưu
            </Button>
          </Grid2>
          <Grid2 xs={12}>
            <TextField fullWidth />
          </Grid2>
          <Typography variant="body1">Shoppe</Typography>
        </Grid2>
      </Card>
    </Container>
  );
}
