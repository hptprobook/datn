
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useResponsive } from 'src/hooks/use-responsive';



import { Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import AccountPopover from '../common/account-popover';
import NotificationsPopover from '../common/notifications-popover';

// ----------------------------------------------------------------------

export default function Header() {
  const route = useRouter();
  const lgUp = useResponsive('up', 'lg');
  return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover /> */}
        <Button color="inherit" onClick={() => route.push('/')} variant="contained">
          Dashboard
        </Button>
        <NotificationsPopover />
        <AccountPopover />
      </Stack>
  );
}
