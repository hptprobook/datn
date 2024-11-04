import { Helmet } from 'react-helmet-async';

import { ReceiptView } from 'src/sections/receipts/view';

// ----------------------------------------------------------------------

export default function ReceiptPage() {
  return (
    <>
      <Helmet>
        <title> Hóa đơn</title>
      </Helmet>

      <ReceiptView />
    </>
  );
}
