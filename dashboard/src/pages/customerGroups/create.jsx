import { Helmet } from 'react-helmet-async';
import {CreateCustomerGroupView }  from 'src/sections/customerGroups/create';

// ----------------------------------------------------------------------

export default function createCustomerGroupPage() {
  return (
    <>
      <Helmet>
        <title>Tạo nhóm khách hàng</title>
      </Helmet>

      <CreateCustomerGroupView />
    </>
  );
}
