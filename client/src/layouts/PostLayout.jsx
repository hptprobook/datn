import React from 'react';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';

export default function PostLayout({ children }) {
  return (
    <React.Fragment>
      <div className="sticky top-0 z-50 block">
        <Header />
        <NavBar />
      </div>
      <div className="mt-8">{children}</div>
      <Footer />
    </React.Fragment>
  );
}
