import { Helmet } from 'react-helmet-async';
import { SuppliersView } from 'src/sections/suppliers/view';

// ----------------------------------------------------------------------

export default function SupplierViewPage() {
  return (
    <>
      <Helmet>
        <title> Nhà cung cấp </title>
      </Helmet>
      <SuppliersView />
    </>
  );
}
