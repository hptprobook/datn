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
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
import WebIcon from '~/assets/logo4.png';
import { WebConfigProvider } from './context/WebsiteConfig';

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
      <WebConfigProvider>
        <HelmetProvider>
          <Helmet>
            <title>BMT Life - Thời Trang Đẳng Cấp | Mua Sắm Dễ Dàng</title>
            <meta
              name="description"
              content="BMT Life là website thời trang chuyên cung cấp quần áo, giày dép, túi xách và phụ kiện với chất lượng cao và giá cả phải chăng. Cập nhật xu hướng mới nhất và tận hưởng dịch vụ mua sắm chuyên nghiệp."
            />
            <meta
              name="keywords"
              content="BMT Life, thời trang, quần áo, giày dép, túi xách, phụ kiện, mua sắm, thời trang nam nữ"
            />
            <meta
              property="og:title"
              content="BMT Life - Thời Trang Đẳng Cấp | Mua Sắm Dễ Dàng"
            />
            <meta
              property="og:description"
              content="Website thời trang chuyên cung cấp quần áo, giày dép, túi xách, phụ kiện với chất lượng cao và giá cả phải chăng. Cập nhật xu hướng thời trang mới nhất."
            />
            <meta property="og:url" content="https://bmtlife.com" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <link
              id="favicon"
              rel="icon"
              href={WebIcon}
              type="image/png"
              sizes="16x16"
            />
          </Helmet>
          <CartProvider>
            <WishlistProvider>
              <UserProvider>
                <ReactQueryDevtools initialIsOpen={false} />
                <ToastContainer />
                <App />
              </UserProvider>
            </WishlistProvider>
          </CartProvider>
        </HelmetProvider>
      </WebConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
