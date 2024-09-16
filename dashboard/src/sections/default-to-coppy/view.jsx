
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

export default function UserPage() {

  const route = useRouter();

 
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Người dùng</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
          Thêm người dùng
        </Button>
      </Stack>

      <Card>
  
        Hello
      </Card>
    </Container>
  );
}
