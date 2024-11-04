import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';
import { Helmet } from 'react-helmet-async';
import WebIcon from '~/assets/logo4.png';
import { useWebConfig } from './context/WebsiteConfig';
// import PhoneSignIn from './components/Auth/PhoneSignIn';

const App = () => {
  const { config } = useWebConfig();
  return (
    <NotifyProvider>
      <Helmet>
        <title>
          {config?.nameCompany ||
            'BMT Life - Thời Trang Đẳng Cấp | Mua Sắm Dễ Dàng'}
        </title>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          id="favicon"
          rel="icon"
          href={WebIcon}
          type="image/png"
          sizes="16x16"
        />
      </Helmet>
      <ScrollToTop />
      <Routes />
      {/* <PhoneSignIn /> */}
    </NotifyProvider>
  );
};

export default App;
