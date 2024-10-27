import { Helmet } from 'react-helmet-async';

import { CustomerGroupView } from 'src/sections/customerGroups/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>  Nhóm khách hàng </title>
      </Helmet>

      <CustomerGroupView />
    </>
  );
}
