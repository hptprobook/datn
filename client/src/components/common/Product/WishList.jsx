import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ProductItem from '~/components/common/Product/ProductItem';
import PropTypes from 'prop-types';
import { useUser } from '~/context/UserContext';
import EmptyCart from '~/components/Home/Header/EmptyCart';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from '~/APIs';
import { useSwal } from '~/customHooks/useSwal';

const WishList = ({ isOpen, onClose }) => {
  const [sortOption, setSortOption] = useState('');
  const { user, refetchUser } = useUser();
  const userFavorites = user && user.favorites ? user.favorites : [];

  const { mutate } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công!',
        description: 'Đã xóa sản phẩm khỏi danh sách yêu thích!',
        confirmButtonText: 'Xác nhận',
      });
      refetchUser();
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Thất bại!',
        description:
          'Lỗi khi xóa sản phẩm khỏi danh sách yêu thích, vui lòng thử lại!',
        confirmButtonText: 'Xác nhận',
      });
    },
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedFavorites = [...userFavorites].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleRemoveFromWishlist = (productId) => {
    const updatedFavorites = userFavorites.filter(
      (item) => item._id !== productId
    );
    mutate({ favorites: updatedFavorites });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex justify-center items-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-20"
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
            {sortedFavorites.map((item) => (
              <div key={item._id} className="relative">
                <ProductItem
                  product={item}
                  isWishList={true}
                  handleLinkClickInWishList={onClose}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {userFavorites.length === 0 && <EmptyCart usedBy="wishList" />}
        </div>
      </div>
    </div>
  );
};

WishList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WishList;
