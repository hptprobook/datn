import { Outlet } from 'react-router-dom';
import Footer from '~/components/Home/Footer/Footer';
import Header from '~/components/Home/Header/Header';
import NavBar from '~/components/Home/NavBar/NavBar';

export default function MainLayout() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-20">
        <Header />
        <NavBar />
      </div>
      <div className="mt-8">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
