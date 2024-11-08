import { Helmet } from 'react-helmet-async';
import { CreateReceiptWarehouseView } from 'src/sections/receiptsWarehouse/create';

// ----------------------------------------------------------------------

export default function ReceiptWarehousePage() {
  return (
    <>
      <Helmet>
        <title> Tạo hóa đơn kho</title>
      </Helmet>

      <CreateReceiptWarehouseView />
    </>
  );
}
