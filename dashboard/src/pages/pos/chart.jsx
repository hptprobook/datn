import { Helmet } from 'react-helmet-async';

// eslint-disable-next-line import/named
import { TrackingView } from 'src/sections/pos';

// ----------------------------------------------------------------------

export default function ChartPosPage() {
  return (
    <>
      <Helmet>
        <title> Thống kê</title>
      </Helmet>
      <TrackingView />
    </>
  );
}
