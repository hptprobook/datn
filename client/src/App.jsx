import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';
import { Helmet } from 'react-helmet-async';
import WebIcon from '~/assets/logo4.png';
import { useWebConfig } from './context/WebsiteConfig';
// import { SocketProvider } from './context/SocketContext';
// import PhoneSignIn from './components/Auth/PhoneSignIn';

const App = () => {
  const { config } = useWebConfig();
  // Hàm tính khoảng cách giữa hai tọa độ bằng công thức Haversine
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính trái đất tính theo km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Kết quả tính theo km
  }

  // Danh sách các kho với toạ độ
  const warehouses = [
    { name: 'Kho A', latitude: 10.762622, longitude: 106.660172 },
    {
      name: 'Kho B',
      latitude: 12.668157722441334,
      longitude: 108.03781353068327,
    },
    { name: 'Kho C', latitude: 16.047079, longitude: 108.20623 },
  ];

  // Lấy vị trí hiện tại của người dùng
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Tìm kho gần nhất
      let nearestWarehouse = null;
      let minDistance = Infinity;

      warehouses.forEach((warehouse) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          warehouse.latitude,
          warehouse.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestWarehouse = warehouse;
        }
      });

      console.log(
        'Kho gần nhất:',
        nearestWarehouse,
        'Khoảng cách:',
        minDistance,
        'km'
      );
    },
    (error) => {
      console.error('Error getting location:', error);
    }
  );

  return (
    // <SocketProvider>
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
    // </SocketProvider>
  );
};

export default App;
