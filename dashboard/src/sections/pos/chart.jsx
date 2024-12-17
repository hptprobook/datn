import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { receiptStatisticsPos } from 'src/redux/slices/dashboardSlices';
import AppWidgetSummary from '../overview/app-widget-summary';
import AppWebsiteVisits from '../overview/app-website-visits';
// import AppTrafficBySite from '../app-traffic-by-site';

// ----------------------------------------------------------------------

export default function ChartView() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.dashboard.receiptStatisticsPos);

  useEffect(() => {
    dispatch(receiptStatisticsPos());
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <AppWebsiteVisits
            title="Thông kê hôm nay"
            subheader=""
            chart={{
              labels: ['00:00 - 08:00', '08:00 - 12:00', '12:00 - 16:00', '16:00 - 23:59'],
              series: [
                // {
                //   name: 'Hóa đơn online',
                //   type: 'line',
                //   fill: 'solid',
                //   data: data?.dataChart.results || [],
                // },
                {
                  name: 'Tổng tiền tại cửa hàng',
                  type: 'area',
                  fill: 'gradient',
                  data: data?.dataChart.totalReciept || [],
                },
                {
                  name: 'Tổng tiền tại hóa đơn',
                  type: 'area',
                  fill: 'gradient',
                  data: data?.dataChart.totalOrderPayment || [],
                },
                // {
                //   name: 'Đơn hàng tạo mới',
                //   type: 'line',
                //   fill: 'solid',
                //   data: data?.dataChart?.resultsOrder || [],
                // },
              ],
            }}
          />
        </Grid>

        <Grid container xs={12} md={6}>
          <Grid xs={6}>
            <AppWidgetSummary
              title="Doanh thu đơn hàng"
              total={data?.revenueOrder || 0}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>

          <Grid xs={6}>
            <AppWidgetSummary
              title="Doanh thu tại quán"
              total={data?.revenue || 0}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>

          <Grid xs={6}>
            <AppWidgetSummary
              title="Số đơn tại quán"
              total={data?.count || 0}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>

          <Grid xs={6}>
            <AppWidgetSummary
              title="Đơn hàng mới"
              total={data?.countOrder || 0}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
