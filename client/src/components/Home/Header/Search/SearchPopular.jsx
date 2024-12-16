import { Badge } from 'flowbite-react';
import { FaFire } from 'react-icons/fa6';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHotSearch } from '~/APIs';
import { useQuery } from '@tanstack/react-query';
import './style.css';
import { capitalizeFirstLetter } from '~/utils/formatters';
// import { useWebConfig } from '~/context/WebsiteConfig';

const SearchPopular = ({ handleModelClick, isOpen, handleOverlayClick }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['hotSearch'],
    queryFn: getHotSearch,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });
  // const { minMaxPrice = { minPrice: 0, maxPrice: 0 } } = useWebConfig();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (isLoading)
    return (
      <div
        className="w-full h-[620px] bg-yellow-50 flex justify-center items-center"
        onClick={handleModelClick}
      >
        <div className="search-loader"></div>
      </div>
    );

  return (
    <div className="w-full h-32 bg-yellow-50" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        <div className="flex gap-3 items-center pt-6">
          <FaFire className="text-red-500" />
          <p className="font-bold">Tìm kiếm phổ biến nhất</p>
        </div>
        <div className="flex gap-3 items-center mt-3">
          {data.map((item) => (
            <Link
              key={item._id}
              to={`/tim-kiem?keyword=${item?.keyword || ''}`}
            >
              <Badge
                color="light"
                className="cursor-pointer rounded-xs px-3 max-w-[150px] truncate"
                onClick={handleOverlayClick}
              >
                {capitalizeFirstLetter(item?.keyword || '')}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchPopular.propTypes = {
  handleModelClick: PropTypes.func,
  handleOverlayClick: PropTypes.func,
};

export default SearchPopular;
