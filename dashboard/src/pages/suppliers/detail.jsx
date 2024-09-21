import { Helmet } from 'react-helmet-async';
import { SupplierDetailView } from 'src/sections/suppliers/detail';

// ----------------------------------------------------------------------

export default function SupplierDetailPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết nhà cung cấp </title>
      </Helmet>
      <SupplierDetailView />
    </>
  );
}
