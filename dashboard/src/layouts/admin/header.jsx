import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import AccountPopover from '../common/account-popover';
import NotificationsPopover from '../common/notifications-popover';

// ----------------------------------------------------------------------

export default function Header() {
  const route = useRouter();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Button color="inherit" onClick={() => route.push('/')} variant="contained">
        Dashboard
      </Button>
      <Button color="inherit" onClick={() => route.push('/pos')} variant="contained">
        Bán hàng
      </Button>
      <NotificationsPopover />
      <AccountPopover />
    </Stack>
  );
}
