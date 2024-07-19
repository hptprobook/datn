import { Helmet } from 'react-helmet-async';
import {CreateProductView }  from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function CreateProductPage() {
  return (
    <>
      <Helmet>
        <title>Create Products</title>
      </Helmet>

      <CreateProductView />
    </>
  );
}
