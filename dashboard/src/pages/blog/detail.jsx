import { Helmet } from 'react-helmet-async';
import {DetailBlogView }  from 'src/sections/blog/detail';

// ----------------------------------------------------------------------

export default function DetailBlogPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa bài viết</title>
      </Helmet>

      <DetailBlogView />
    </>
  );
}
