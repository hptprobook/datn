import { Helmet } from 'react-helmet-async';
import { TrackingInventorView } from 'src/sections/pos';

// ----------------------------------------------------------------------

export default function TrackingInventorPage() {
  return (
    <>
      <Helmet>
        <title> Tra cứu tồn kho</title>
      </Helmet>
      <TrackingInventorView />
    </>
  );
}
