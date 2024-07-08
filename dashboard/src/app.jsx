/* eslint-disable import/no-unresolved */
/* eslint-disable perfectionist/sort-imports */

/* eslint-disable import/no-extraneous-dependencies  */
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
// eslint-disable-next-line import/no-unresolved
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
}
