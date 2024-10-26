import { Helmet } from 'react-helmet-async';
import {DetailCustomerGroupView }  from 'src/sections/customerGroups/detail';

// ----------------------------------------------------------------------

export default function DetailCustomerGroupPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa nhóm khách hàng</title>
      </Helmet>

      <DetailCustomerGroupView />
    </>
  );
}
