import { Helmet } from 'react-helmet-async';

// eslint-disable-next-line import/named
import { CategoryView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

export default function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title> Danh Mục</title>
      </Helmet>

      <CategoryView />
    </>
  );
}
