/* eslint-disable indent */
import PropTypes from 'prop-types';

const ProductLabelBadge = ({ text }) => {
  const bgColor =
    text === 'Bán chạy'
      ? 'bg-red-600'
      : text === 'Freeship'
      ? 'bg-green-600'
      : text === 'Hot sale'
      ? 'bg-orange-600'
      : 'bg-gray-600';

  return (
    <div className={`px-2 py-1 ${bgColor} text-white rounded-xs text-xs`}>
      {text}
    </div>
  );
};

ProductLabelBadge.propTypes = {
  text: PropTypes.string,
};

export default ProductLabelBadge;
