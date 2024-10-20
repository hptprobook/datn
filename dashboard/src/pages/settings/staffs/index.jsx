import { Helmet } from 'react-helmet-async';
import { StaffsView } from 'src/sections/settings/staffs';

// ----------------------------------------------------------------------

export default function StaffsSettingPage() {
  return (
    <>
      <Helmet>
        <title> Quản lý nhân viên </title>
      </Helmet>
      <StaffsView />
    </>
  );
}
