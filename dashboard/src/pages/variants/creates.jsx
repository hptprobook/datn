import { Helmet } from 'react-helmet-async';
import { VariantsImportView } from 'src/sections/variants/import';


// ----------------------------------------------------------------------

export default function VariantsImportPage() {
  return (
    <>
      <Helmet>
        <title> Biến thể  </title>
      </Helmet>

      <VariantsImportView />
    </>
  );
}
