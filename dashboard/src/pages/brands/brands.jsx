import { Helmet } from 'react-helmet-async';
import { BrandsView } from 'src/sections/brands/view';

// ----------------------------------------------------------------------

export default function CouponsPage() {
  return (
    <>
      <Helmet>
        <title> Thương hiệu</title>
      </Helmet>
      <BrandsView />
    </>
  );
}
