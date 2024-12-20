import { IoIosSearch, IoMdCloseCircleOutline } from 'react-icons/io';
import { useState, useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import SearchPopular from './SearchPopular';
import SearchResult from './SearchResult';
import { getSearchSuggest, searchProducts } from '~/APIs/ProductList/search';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// import { useWebConfig } from '~/context/WebsiteConfig';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  // const { minMaxPrice = { minPrice: 0, maxPrice: 0 } } = useWebConfig();
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(5);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsFocused(false);
    setSearchValue('');
    document.body.style.overflow = 'unset';
  }, [location]);

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

  const debouncedSearch = useCallback(
    debounce((value) => {
      setKeyword(value?.trim() || '');
    }, 1000),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target?.value || '';
    setSearchValue(value);

    if (value.endsWith(' ')) {
      setKeyword(value.trim());
    } else {
      debouncedSearch(value);
    }
  };

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', keyword, limit],
    queryFn: () =>
      searchProducts({
        keyword,
        limit,
        // minPrice: minMaxPrice?.minPrice,
        // maxPrice: minMaxPrice?.maxPrice,
      }),
    enabled: keyword !== '',
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ['suggestions', keyword],
    queryFn: () => getSearchSuggest(keyword, 5),
    enabled: keyword.length > 0,
  });

  const handleOverlayClick = () => {
    setIsFocused(false);
  };

  const handleModelClick = (e) => {
    e.stopPropagation();
  };

  const getSearchUrl = () => {
    const params = new URLSearchParams({
      keyword: searchValue?.trim() || '',
      // minPrice: minMaxPrice?.minPrice || 0,
      // maxPrice: minMaxPrice?.maxPrice || 0,
    });
    return `/tim-kiem?${params.toString()}`;
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === 'Enter' && searchValue?.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchValue.trim())}`);
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchValue('');
    }
  };

  const handleSearchButtonClick = () => {
    if (searchValue?.trim()) {
      navigate(getSearchUrl());
      handleOverlayClick();
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  return (
    <div>
      <form className="flex relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="w-search h-10 rounded-l-md outline-none pl-3 text-sm bg-white"
          placeholder={
            isFocused
              ? 'Nhập từ khoá (Quần áo, giày dép, phụ kiện, ...)'
              : 'Tổ hợp Ctrl + K để tìm kiếm sản phẩm'
          }
          onFocus={() => setIsFocused(true)}
          onChange={handleInputChange}
          value={searchValue}
          onKeyUp={handleSearchKeyUp}
          onKeyDown={handleSearchKeyDown}
          ref={inputRef}
        />
        <button
          type="button"
          onClick={handleSearchButtonClick}
          className="w-12 h-10 bg-red-800 rounded-r-md flex justify-center items-center"
        >
          <IoIosSearch className="text-gray-50" />
        </button>
        <div className="absolute top-0 right-16 top-1/2 -translate-y-1/2 rounded-md badge badge-primary hidden md:block">
          Ctrl + K
        </div>
      </form>
      {isFocused && (
        <div
          className="mt-16 fixed w-fvw bg-slate-400 bg-opacity-60 h-fvh left-0 top-4 z-20"
          onClick={handleOverlayClick}
        >
          <div
            className="absolute top-4 right-8 text-3xl cursor-pointer text-red-400"
            onClick={handleOverlayClick}
          >
            <IoMdCloseCircleOutline />
          </div>
          {!searchValue ? (
            <SearchPopular
              handleModelClick={handleModelClick}
              isOpen={isFocused}
              handleOverlayClick={handleOverlayClick}
            />
          ) : (
            <SearchResult
              handleModelClick={handleModelClick}
              searchResults={searchResults?.data?.products || []}
              searchLoading={searchLoading}
              isOpen={isFocused}
              keyword={keyword}
              closeModal={handleOverlayClick}
              suggestions={suggestionsData?.suggestions || []}
            />
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {};

export default SearchBar;
