import { Helmet } from 'react-helmet-async';
import {CreateCustormerGroupView }  from 'src/sections/customerGroups/create';

// ----------------------------------------------------------------------

export default function CreateCustormerGroupPage() {
  return (
    <>
      <Helmet>
        <title>Tạo nhóm khách hàng</title>
      </Helmet>

      <CreateCustormerGroupView />
    </>
  );
}
