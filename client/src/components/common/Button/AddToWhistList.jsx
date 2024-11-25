import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaHeart } from 'react-icons/fa';
import { updateCurrentUser } from '~/APIs';
import { useUser } from '~/context/UserContext';
import { handleToast } from '~/customHooks/useToast';
import { useSwal } from '~/customHooks/useSwal';

const MAX_FAVORITES = 20;

const AddToWishListBtn = ({ product, isInProductItem = false }) => {
  const { user, refetchUser } = useUser();
  const [isDebounced, setIsDebounced] = useState(false);

  const isInWishlist = user?.favorites.some((fav) => fav._id === product._id);

  const { mutate } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      handleToast(
        'success',
        isInWishlist
          ? 'Đã xoá sản phẩm khỏi danh sách yêu thích!'
          : 'Đã thêm sản phẩm vào danh sách yêu thích!'
      );
      refetchUser();
    },
    onError: () => {
      handleToast(
        'error',
        'Lỗi khi cập nhật danh sách yêu thích, vui lòng thử lại!'
      );
    },
  });

  const handleToggleWishList = () => {
    if (isDebounced) return;

    if (!isInWishlist && user.favorites.length >= MAX_FAVORITES) {
      useSwal.fire({
        icon: 'error',
        title: 'Lỗi!',
        description: 'Danh sách yêu thích không được vượt quá 20 sản phẩm!',
        confirmButtonText: 'Xác nhận',
      });
      return;
    }

    const { _id, name, price, thumbnail, slug } = product;

    const totalComment =
      product.totalComment !== undefined
        ? product.totalComment
        : product.reviews?.length || 0;

    const averageRating =
      product.averageRating !== undefined
        ? product.averageRating
        : totalComment
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalComment
        : 0;

    const updatedFavorites = isInWishlist
      ? user.favorites.filter((fav) => fav._id !== _id)
      : [
          ...user.favorites,
          { _id, name, price, slug, thumbnail, totalComment, averageRating },
        ];

    mutate({ favorites: updatedFavorites });

    setIsDebounced(true);
    setTimeout(() => setIsDebounced(false), 1500);
  };

  return (
    <button
      className={`p-2 rounded-full ${
        isInWishlist ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
      } hover:bg-red-600 hover:text-white transition-colors`}
      onClick={handleToggleWishList}
      title={
        isInWishlist
          ? 'Xóa sản phẩm khỏi danh sách yêu thích'
          : 'Thêm sản phẩm vào danh sách yêu thích'
      }
      disabled={isDebounced}
    >
      {!isInProductItem ? (
        <FaHeart className="w-6 h-6" />
      ) : (
        <FaHeart className="w-4 h-3" />
      )}
    </button>
  );
};

export default AddToWishListBtn;
