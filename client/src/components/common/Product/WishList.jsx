import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';

const WishList = ({ isOpen, onClose, wishlistItems, onRemoveFromWishlist }) => {
  const [sortOption, setSortOption] = useState('');

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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // Implement sorting logic here
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex justify-center items-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Danh sách yêu thích của bạn
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>

          {/* Sorting Form */}
          <div className="mb-8 sticky top-0 bg-white z-20 py-4 shadow-sm">
            <form className="flex space-x-4 items-center">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Sắp xếp
              </label>
              <select
                className="select select-bordered w-full max-w-xs select-sm bg-white text-black"
                onChange={handleSortChange}
                value={sortOption}
              >
                <option value="">Mặc định</option>
                <option value="name-asc">Theo tên (A-Z)</option>
                <option value="name-desc">Theo tên (Z-A)</option>
                <option value="price-asc">Theo giá (thấp đến cao)</option>
                <option value="price-desc">Theo giá (cao đến thấp)</option>
              </select>
            </form>
          </div>

          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map((item) => (
              <div key={item._id} className="relative">
                <ProductItem product={item} />
                <button
                  onClick={() => onRemoveFromWishlist(item._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {wishlistItems.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              Your wishlist is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

WishList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  wishlistItems: PropTypes.array.isRequired,
  onRemoveFromWishlist: PropTypes.func.isRequired,
};

export default WishList;
