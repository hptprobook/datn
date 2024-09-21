import { Helmet } from 'react-helmet-async';
import { SupplierCreateView } from 'src/sections/suppliers/create';

// ----------------------------------------------------------------------

export default function SupplierCreatePage() {
  return (
    <>
      <Helmet>
        <title> Tạo nhà cung cấp </title>
      </Helmet>
      <SupplierCreateView />
    </>
  );
}
