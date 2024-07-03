import { IoIosSearch } from 'react-icons/io';
import { PiShoppingCartBold } from 'react-icons/pi';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import CardFixed from '~/components/Home/CardFixed';
import { useState } from 'react';
import Logo from '~/assets/logo2.png';

export default function HomePage() {
  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <header className="w-full h-16 bg-amber-600">
        <div className="max-w-container h-full mx-auto flex justify-between items-center">
          <div>
            <img src={Logo} alt="Logo" className="h-full w-56" />
          </div>
          <div>
            <form className="flex">
              <input
                type="text"
                className="w-search h-10 rounded-l-md outline-none pl-3 text-sm"
                placeholder="Tìm kiếm ..."
              />
              <button
                type="submit"
                className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
              >
                <IoIosSearch className="text-gray-50" />
              </button>
            </form>
          </div>
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
            <div className="relative text-2xl text-gray-50 cursor-pointer group">
              <FaRegUserCircle />
              <div className="absolute w-80 top-11 right-0 bg-gray-100 cursor-default py-4 px-8 text-xs text-center shadow-md shadow-gray-200 hidden group-hover:block before:absolute before:w-8 before:h-5 before:-top-5 before:right-0 before:bg-transparent">
                <p className="font-bold uppercase px-9 leading-5 text-black">
                  Chào mừng quý khách đến với w0w Store
                </p>
                <p className="mt-5 text-black">Bạn đã có tài khoản w0wStore</p>
                <button className="w-full h-8 bg-red-700 rounded-md my-3 hover:shadow-md hover:shadow-gray-300">
                  Đăng nhập
                </button>
                <p className="pt-3 border-t border-gray-200 mb-3 text-black">
                  hoặc
                </p>
                <button className="w-full h-8 bg-white rounded-md text-black border-solid border-2 hover:bg-red-700 hover:text-white hover:border-red-700 transform transition duration-300">
                  Đăng ký thành viên
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
