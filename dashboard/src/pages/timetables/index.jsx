import { Helmet } from 'react-helmet-async';
import { TimetableView } from 'src/sections/timetables/view';


// ----------------------------------------------------------------------

export default function TimetablePage() {
  return (
    <>
      <Helmet>
        <title> Lịch làm việc  </title>
      </Helmet>

      <TimetableView />
    </>
  );
}
