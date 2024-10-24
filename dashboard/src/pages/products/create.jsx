import { Helmet } from 'react-helmet-async';
import { CreateProductView } from 'src/sections/products/create';

// ----------------------------------------------------------------------

export default function CreateProductPage() {
  return (
    <>
      <Helmet>
        <title>Tạo sản phẩm</title>
      </Helmet>

      <CreateProductView />
    </>
  );
}
