import { Helmet } from 'react-helmet-async';
import {CreateBlogView }  from 'src/sections/blog/create';

// ----------------------------------------------------------------------

export default function CreateBlogPage() {
  return (
    <>
      <Helmet>
        <title>Tạo mới bài viết</title>
      </Helmet>

      <CreateBlogView />
    </>
  );
}
