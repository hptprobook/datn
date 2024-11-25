import { Helmet } from 'react-helmet-async';
import { DetailUserView } from 'src/sections/user/detail';

// ----------------------------------------------------------------------

export default function UserDetailPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết </title>
      </Helmet>
      <DetailUserView />
    </>
  );
}
