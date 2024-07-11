import { PiShoppingCartBold } from 'react-icons/pi';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '~/assets/logo2.png';
import CardFixed from '~/components/Home/Header/CardFixed';
import UserBar from '~/components/Home/Header/UserBar';
import SideNavMenu from './Responsive/SideNavMenu';
import SearchBar from './Search/SearchBar';
import SearchResponsiveModal from './Responsive/SearchResponsiveModal';

export default function Header() {
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const [currentTitle, setCurrentTitle] = useState('Danh mục');

  return (
    <div>
      {/* Header dùng chung cho Window */}
      <header className="w-full h-16 bg-amber-600 hidden lg:block">
        <div className="max-w-container h-full mx-auto flex justify-between items-center">
          <NavLink to="/">
            <div>
              <img src={Logo} alt="Logo" className="h-full w-56" />
            </div>
          </NavLink>
          <SearchBar />
          <div className="flex gap-4">
            <div
              className="text-2xl text-gray-50 cursor-pointer relative"
              onClick={() => setOpenCart(true)}
            >
              <PiShoppingCartBold />
              <div className="absolute -top-2 -right-3 bg-red-700 text-white rounded-md w-6 h-4 flex items-center justify-center text-xs">
                5
              </div>
            </div>
            <CardFixed open={openCart} setOpen={setOpenCart} />
            <div className="text-2xl text-gray-50 cursor-pointer">
              <MdOutlineContentPasteSearch />
            </div>
            <UserBar />
          </div>
        </div>
      </header>

      {/* Header dùng chung cho Mobile & Tablet */}
      <header className="w-full h-16 bg-amber-600 lg:hidden flex justify-between items-center px-4 z-10">
        <div
          className="text-2xl text-gray-50 cursor-pointer"
          onClick={() => setOpenMenu(true)}
        >
          <FaBars />
        </div>
        <NavLink to="/" className="flex-grow text-center">
          <img src={Logo} alt="Logo" className="h-full w-52 mx-auto" />
        </NavLink>
        <div className="flex gap-4">
          <div
            className="text-2xl text-gray-50 cursor-pointer"
            onClick={() => setOpenSearch(true)}
          >
            <IoIosSearch />
          </div>
          <div
            className="text-2xl text-gray-50 cursor-pointer relative"
            onClick={() => setOpenCart(true)}
          >
            <PiShoppingCartBold />
            <div className="absolute -top-2 -right-3 bg-red-700 text-white rounded-md w-6 h-4 flex items-center justify-center text-xs">
              5
            </div>
          </div>
          <CardFixed open={openCart} setOpen={setOpenCart} />
        </div>
      </header>

      {/* Side Nav Menu */}
      <SideNavMenu
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
      />

      {/* Search Drawer for Mobile & Tablet */}
      <SearchResponsiveModal
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
    </div>
  );
}
