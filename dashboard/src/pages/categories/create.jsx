import { Helmet } from 'react-helmet-async';
import { CreateCategoryView } from 'src/sections/categories/create';

// ----------------------------------------------------------------------

export default function CreateCategoryPage() {
  return (
    <>
      <Helmet>
        <title>Tạo Danh Mục</title>
      </Helmet>

      <CreateCategoryView />
    </>
  );
}
