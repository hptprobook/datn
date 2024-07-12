import { IoIosSearch, IoMdCloseCircleOutline } from 'react-icons/io';
import { useState } from 'react';
import SearchPopular from './SearchPopular';
import SearchResult from './SearchResult';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  /* Hàm click vào overlay của model tìm kiếm thì đóng model */
  const handleOverlayClick = () => {
    setIsFocused(false);
  };

  /* Hàm click overlay loại trừ model không phải */
  const handleModelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {/* Form Tìm kiếm */}
      <form className="flex">
        <input
          type="text"
          className="w-search h-10 rounded-l-md outline-none pl-3 text-sm"
          placeholder="Tìm kiếm ..."
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          type="submit"
          className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
        >
          <IoIosSearch className="text-gray-50" />
        </button>
      </form>
      {/* Model Tìm kiếm */}
      {isFocused && (
        <div
          className="mt-16 fixed w-fvw bg-slate-400 bg-opacity-60 h-fvh left-0 top-0 z-20"
          onClick={handleOverlayClick}
        >
          <div
            className="absolute top-4 right-8 text-3xl cursor-pointer text-red-400"
            onClick={handleOverlayClick}
          >
            <IoMdCloseCircleOutline />
          </div>
          {/* Tìm kiếm phổ biến */}
          {searchValue === '' ? (
            <SearchPopular handleModelClick={handleModelClick} />
          ) : (
            /* Tìm kiếm gợi ý */
            <SearchResult handleModelClick={handleModelClick} />
          )}
        </div>
      )}
    </div>
  );
}
