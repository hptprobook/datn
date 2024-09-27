import { Badge } from 'flowbite-react';
import { FaFire } from 'react-icons/fa6';
import { hotSearch } from '~/APIs/mock_data';
import PropTypes from 'prop-types';

const SearchPopular = ({ handleModelClick }) => {
  return (
    <div className="w-full h-32 bg-yellow-50" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        <div className="flex gap-3 items-center pt-6">
          <FaFire className="text-red-500" />
          <p className="font-bold">Tìm kiếm phổ biến nhất</p>
        </div>
        <div className="flex gap-3 items-center mt-3">
          {hotSearch.map((item, index) => (
            <Badge
              key={index}
              color="light"
              className="cursor-pointer rounded-xs px-3"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchPopular.propTypes = {
  handleModelClick: PropTypes.func,
};

export default SearchPopular;
