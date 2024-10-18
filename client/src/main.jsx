// File css toàn cục
import './index.css';

// React
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// React router dom
import { BrowserRouter } from 'react-router-dom';

// React query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helpers
import { handleApiError } from './config/helpers.js';

// useCart
import { CartProvider } from 'react-use-cart';
import { WishlistProvider } from './context/WishListContext';
import '~/config/firebaseConfig';
import { UserProvider } from './context/UserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    },
    mutations: {
      onError: (error) => {
        handleApiError(error);
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter basename="/">
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <UserProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
            <App />
          </UserProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
