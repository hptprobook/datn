import { Helmet } from 'react-helmet-async';
import { EditStaffView } from 'src/sections/settings/staffs';

// ----------------------------------------------------------------------

export default function EditStaffPage() {
  return (
    <>
      <Helmet>
        <title> Chỉnh sửa nhân viên </title>
      </Helmet>
      <EditStaffView />
    </>
  );
}
