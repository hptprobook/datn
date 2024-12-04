import { Helmet } from 'react-helmet-async';
import { FileManagerView } from 'src/sections/fileManager/view';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <>
      <Helmet>
        <title> Quản lý ảnh </title>
      </Helmet>
      <FileManagerView />
    </>
  );
}
