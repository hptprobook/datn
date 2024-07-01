// import React from 'react';
import CssBaseLine from '@mui/material/CssBaseline';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from 'material-ui-confirm';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { BrowserRouter } from 'react-router-dom';
import './main.css';
import '~/config/firebaseConfig';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <CssBaseLine />
        <ConfirmProvider
          defaultOptions={{
            confirmationButtonProps: {
              color: 'secondary',
              variant: 'outlined',
            },
            cancellationButtonProps: { color: 'inherit' },
          }}
        >
          <App />
        </ConfirmProvider>
        <ToastContainer
          theme="colored"
          hideProgressBar
          position="bottom-left"
          autoClose={3000}
          closeOnClick
        />
      </BrowserRouter>
    </Provider>
  </CssVarsProvider>
  // </React.StrictMode>
);
