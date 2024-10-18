import { Helmet } from 'react-helmet-async';
import { DetailWebBannerView } from 'src/sections/webBanner/detail';

// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function WebBannerDetailPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết </title>
      </Helmet>
      <DetailWebBannerView />
    </>
  );
}
