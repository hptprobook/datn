import { Helmet } from 'react-helmet-async';
import { BrandCreateView } from 'src/sections/brands/create';
// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function CreateBrandPage() {
  return (
    <>
      <Helmet>
        <title> Tạo nhãn hàng</title>
      </Helmet>
      <BrandCreateView />
    </>
  );
}
