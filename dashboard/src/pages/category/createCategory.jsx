import { Helmet } from 'react-helmet-async';
import {CreateCategoryView }  from 'src/sections/categorys/view';

// ----------------------------------------------------------------------

export default function CreateCategoryPage() {
  return (
    <>
      <Helmet>
        <title>Create Category</title>
      </Helmet>

      <CreateCategoryView />
    </>
  );
}
