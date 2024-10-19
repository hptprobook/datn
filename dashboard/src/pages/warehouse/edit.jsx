import { Helmet } from 'react-helmet-async';
import { WarehouseEditView } from 'src/sections/warehouse/detail';

// ----------------------------------------------------------------------

export default function WarehouseEditPage() {
  return (
    <>
      <Helmet>
        <title> Tạo kho</title>
      </Helmet>
      <WarehouseEditView />
    </>
  );
}
