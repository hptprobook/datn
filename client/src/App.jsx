import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';
import PhoneSignIn from './components/Auth/PhoneSignIn';
import { Helmet } from 'react-helmet-async';

const App = () => {
  return (
    <NotifyProvider>
      <Helmet>
        <title>BMT Life - Thời Trang Đẳng Cấp | Mua Sắm Dễ Dàng</title>
        <meta
          name="description"
          content="BMT Life là website thời trang chuyên cung cấp quần áo, giày dép, túi xách và phụ kiện với chất lượng cao và giá cả phải chăng. Cập nhật xu hướng mới nhất và tận hưởng dịch vụ mua sắm chuyên nghiệp."
        />
      </Helmet>
      <ScrollToTop />
      <Routes />
      <PhoneSignIn />
    </NotifyProvider>
  );
};

export default App;
