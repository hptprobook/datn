import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '~/context/WishListContext';

const AddToWhistListBtn = ({ product, isInWishlist }) => {
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      className={`p-2 rounded-full ${
        isInWishlist ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
      } hover:bg-red-600 hover:text-white transition-colors`}
      onClick={handleWishlistToggle}
    >
      <FaHeart className="w-6 h-6" />
    </button>
  );
};

export default AddToWhistListBtn;
