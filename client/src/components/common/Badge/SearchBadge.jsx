import { Badge } from 'flowbite-react';
import PropTypes from 'prop-types';

const SearchBadge = ({ text, onClick = () => {} }) => {
  return (
    <Badge onClick={onClick} color="gray">
      {text}
    </Badge>
  );
};

SearchBadge.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default SearchBadge;
