import { Helmet } from 'react-helmet-async';
import { ExportProductView } from 'src/sections/products/export';

// ----------------------------------------------------------------------

export default function ExportProductPage() {
  return (
    <>
      <Helmet>
        <title>Xử lý sản phẩm</title>
      </Helmet>

      <ExportProductView />
    </>
  );
}
