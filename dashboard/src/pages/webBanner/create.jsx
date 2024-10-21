import { Helmet } from 'react-helmet-async';
import { CreateWebBannerView } from 'src/sections/webBanner/create';

// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function CreateWebBannerPage() {
  return (
    <>
      <Helmet>
        <title> Tạo banner quảng cáo</title>
      </Helmet>
      <CreateWebBannerView />
    </>
  );
}
