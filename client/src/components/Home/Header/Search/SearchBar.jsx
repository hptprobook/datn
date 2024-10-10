import { IoIosSearch, IoMdCloseCircleOutline } from 'react-icons/io';
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash'; // Import debounce từ lodash
import SearchPopular from './SearchPopular';
import SearchResult from './SearchResult';
import { searchProducts } from '~/APIs/ProductList/search';
import { useQuery } from '@tanstack/react-query';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    if (isFocused) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFocused]);

  // Gọi API tìm kiếm với debounce 1000ms
  const debouncedSearch = useCallback(
    debounce((value) => {
      setKeyword(value);
    }, 1000),
    []
  );

  // Xử lý khi input thay đổi
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', keyword, limit],
    queryFn: () => searchProducts({ keyword, limit }),
    enabled: keyword !== '',
  });

  const handleOverlayClick = () => {
    setIsFocused(false);
  };

  const handleModelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <form className="flex" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="w-search h-10 rounded-l-md outline-none pl-3 text-sm bg-white"
          placeholder="Tìm kiếm ..."
          onFocus={() => setIsFocused(true)}
          onChange={handleInputChange} // Gọi hàm xử lý khi input thay đổi
          value={searchValue}
        />
        <button
          type="submit"
          className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
        >
          <IoIosSearch className="text-gray-50" />
        </button>
      </form>
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
          {searchValue === '' ? (
            <SearchPopular handleModelClick={handleModelClick} />
          ) : (
            <SearchResult
              handleModelClick={handleModelClick}
              searchResults={searchResults?.products}
              searchLoading={searchLoading}
              isOpen={isFocused}
              keyword={keyword}
              closeModal={handleOverlayClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {};

export default SearchBar;
