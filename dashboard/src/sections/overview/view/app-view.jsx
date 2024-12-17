import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  get7DayData,
  userStatistics,
  receiptStatistics,
  productsStatistics,
} from 'src/redux/slices/dashboardSlices';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const now = new Date();
  const currentHour = now.getHours(); // Lấy giờ hiện tại
  const [mess, setMess] = useState(''); // Khởi tạo state cho thông điệp
  const dispatch = useDispatch();
  const users = useSelector((state) => state.dashboard.userStatistics);
  const receipts = useSelector((state) => state.dashboard.receiptStatistics);
  const products = useSelector((state) => state.dashboard.productsStatistics);
  const get7Day = useSelector((state) => state.dashboard.get7DayData);
  const user = useSelector((state) => state.auth.auth);

  useEffect(() => {
    dispatch(userStatistics());
    dispatch(receiptStatistics());
    dispatch(productsStatistics());
    dispatch(get7DayData());
  }, [dispatch]);
  useEffect(() => {
    if (currentHour < 12) {
      setMess('Chào buổi sáng');
    } else if (currentHour < 18) {
      setMess('Chào buổi chiều');
    } else {
      setMess('Chào buổi tối');
    }
  }, [currentHour]);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        {mess}, chào mừng trở lại 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tổng doanh thu"
            total={receipts?.totalReceipts || 0}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Người dùng"
            total={users?.totalUsers || 0}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Đơn hàng (7 ngày)"
            total={get7Day?.countOrders || 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Hóa đơn (7 ngày)"
            total={get7Day?.countReceipts || 0}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12}>
          <AppWebsiteVisits
            title="Thông kê doanh thu"
            subheader=""
            chart={{
              labels: get7Day?.daysArray || [],
              series: [
                {
                  name: 'Hóa đơn online',
                  type: 'column',
                  fill: 'solid',
                  data: get7Day?.receiptsOnlineArray || [],
                },
                {
                  name: 'Hóa đơn tại cửa hàng',
                  type: 'area',
                  fill: 'gradient',
                  data: get7Day?.receiptsStoreArray || [],
                },
                {
                  name: 'Đơn hàng tạo mới',
                  type: 'line',
                  fill: 'solid',
                  data: get7Day?.ordersCountArray || [],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppConversionRates
            title="Các sản phẩm được xem nhiều nhất"
            chart={{
              series: products || [],
            }}
          />
        </Grid>
        {/* <Grid xs={12} md={6}>
          <AppCurrentVisits
            title="Hóa đơn"
            subheader="Doanh thu hóa đơn"
            chart={{
              series: [
                { label: 'Bán tại cửa hàng', value: receipts?.totalStoreReceipts || 0 },
                { label: 'Bán trên website', value: receipts?.totalOnlineReceipts || 0 },
              ],
            }}
          />
        </Grid> */}
        <Grid xs={12} md={6}>
          <AppCurrentVisits
            title="Hóa đơn"
            subheader="Số lượng hóa đơn"
            chart={{
              series: [
                { label: 'Bán tại cửa hàng', value: receipts?.countStoreReceipts || 0 },
                { label: 'Bán trên website', value: receipts?.countOnlineReceipts || 0 },
              ],
            }}
          />
        </Grid>
        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Thống kê thói quen mua hàng"
            subheader='Tính năng đang phát triển'
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate title="Người dùng mới" list={users?.users || []} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Lịch hoạt động"
            // subheader="Tính năng đang phát triển"
            list={user?.notifies || [
              {
                _id: '1',
                title: 'Bạn không có thông báo mới',
              }
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
