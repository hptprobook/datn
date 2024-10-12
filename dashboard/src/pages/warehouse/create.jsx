import { Helmet } from 'react-helmet-async';
import { WarehouseCreateView } from 'src/sections/warehouse/create';

// ----------------------------------------------------------------------

export default function WareHouseCreatePage() {
  return (
    <>
      <Helmet>
        <title> Tạo kho</title>
      </Helmet>
      <WarehouseCreateView />
    </>
  );
}
