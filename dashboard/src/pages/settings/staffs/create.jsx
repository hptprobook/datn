import { Helmet } from 'react-helmet-async';
import { CreateStaffView } from 'src/sections/settings/staffs';

// ----------------------------------------------------------------------

export default function CreateStaffPage() {
  return (
    <>
      <Helmet>
        <title> Tạo nhân viên </title>
      </Helmet>
      <CreateStaffView />
    </>
  );
}
