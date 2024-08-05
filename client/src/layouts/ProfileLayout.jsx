import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';
import ProfileSidebar from '~/components/User/ProfileSidebar';

const ProfileLayout = () => {
  return (
    <React.Fragment>
      <div className="sticky top-0 z-20 hidden md:block">
        <Header />
        <NavBar />
      </div>
      <div className="grid grid-cols-12 gap-4 max-w-container mx-auto mt-2 md:mt-16">
        <div className="col-span-12 md:col-span-3">
          <ProfileSidebar />
        </div>
        <div className="col-span-12 md:col-span-9 mt-28">
          <Outlet />
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default ProfileLayout;
