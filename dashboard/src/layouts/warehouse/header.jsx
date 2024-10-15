import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';

import { Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import Logo from 'src/components/logo';
import { HEADER } from './config-layout';
import NotificationsPopover from '../common/notifications-popover';
import AccountPopover from '../common/account-popover';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();
  const route = useRouter();
  const renderContent = (
    <>
      <Logo />
      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover /> */}
        <Button variant="contained" color="inherit" onClick={() => route.push('/')}>
          Đi đến trang chủ
        </Button>
        <NotificationsPopover />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
