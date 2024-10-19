import { Helmet } from 'react-helmet-async';
import { BrandDetailView } from 'src/sections/brands/detail';

// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function BrandDetailPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết </title>
      </Helmet>
      <BrandDetailView />
    </>
  );
}
