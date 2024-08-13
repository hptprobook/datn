import { Helmet } from 'react-helmet-async';
import { EditCategoryView} from 'src/sections/categorys/edit';

// ----------------------------------------------------------------------

export default function EditCategoryPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa Danh mục</title>
      </Helmet>

      <EditCategoryView />
    </>
  );
}
