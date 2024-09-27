import { Helmet } from 'react-helmet-async';
import { DetailCategoryView } from 'src/sections/categories/detail';

// ----------------------------------------------------------------------

export default function EditCategoryPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa Danh mục</title>
      </Helmet>

      <DetailCategoryView />
    </>
  );
}
