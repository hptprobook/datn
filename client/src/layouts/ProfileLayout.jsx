import { Outlet } from 'react-router-dom';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';
import ProfileSidebar from '~/components/User/ProfileSidebar';

const ProfileLayout = () => {
  return (
    <div className='bg-slate-200'>
      <div className='sticky top-0 z-50 block'>
        <Header />
        <NavBar />
      </div>
      <div className='grid grid-cols-12 gap-4 max-w-container mx-auto mt-2 md:mt-16 pb-24 z-10'>
        <div className='col-span-12 md:col-span-3 md:z-0 z-40'>
          <div className='sticky top-40 md:top-0'>
            {' '}
            {/* Thêm thuộc tính sticky cho sidebar */}
            <ProfileSidebar />
          </div>
        </div>
        <div className='col-span-12 md:col-span-9'>
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout;
