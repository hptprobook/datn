import { Helmet } from 'react-helmet-async';

import { CreateUserView } from 'src/sections/user/create';

// ----------------------------------------------------------------------

export default function CreateUserPage() {
  return (
    <>
      <Helmet>
        <title> Tạo người dùng </title>
      </Helmet>

      <CreateUserView />
    </>
  );
}
