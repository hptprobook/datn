import { Helmet } from 'react-helmet-async';

import { VariantsView } from 'src/sections/variants/view';

// ----------------------------------------------------------------------

export default function VariantsPage() {
  return (
    <>
      <Helmet>
        <title> Biến thể  </title>
      </Helmet>

      <VariantsView />
    </>
  );
}
