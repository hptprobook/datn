import { Helmet } from 'react-helmet-async';

import { ReceiptWarehouseView } from 'src/sections/receiptsWarehouse/view';

// ----------------------------------------------------------------------

export default function ReceiptWarehousePage() {
  return (
    <>
      <Helmet>
        <title> Hóa đơn kho</title>
      </Helmet>

      <ReceiptWarehouseView />
    </>
  );
}
