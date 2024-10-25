import { Helmet } from 'react-helmet-async';
import {DetailCustormerGroupView }  from 'src/sections/customerGroups/detail';

// ----------------------------------------------------------------------

export default function DetailCustormerGroupPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa nhóm khách hàng</title>
      </Helmet>

      <DetailCustormerGroupView />
    </>
  );
}
