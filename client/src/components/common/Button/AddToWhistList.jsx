import { useState, useCallback, useRef } from 'react';
import { handleToast } from '~/customHooks/useToast';

const AddToWhistListBtn = () => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastAddTime = useRef(0);

  const handleWishlistToggle = useCallback(() => {
    const now = Date.now();
    if (isInWishlist || now - lastAddTime.current >= 2000) {
      if (!isInWishlist) {
        lastAddTime.current = now;
      }
      setIsInWishlist(!isInWishlist);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      handleToast(
        isInWishlist ? 'info' : 'success',
        isInWishlist
          ? 'Đã loại bỏ khỏi sản phẩm yêu thích!'
          : 'Đã thêm vào danh sách yêu thích!'
      );
    }
  }, [isInWishlist]);

  return (
    <div className="relative inline-block">
      <button
        className="group transition-all duration-500 p-0.5"
        onClick={handleWishlistToggle}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={`${
              isInWishlist ? 'fill-red-50' : 'fill-gray-100'
            } transition-all duration-500 group-hover:fill-red-100`}
            cx="30"
            cy="30"
            r="30"
          />
          <path
            className={`${
              isInWishlist
                ? 'fill-red-600 stroke-red-600'
                : 'stroke-gray-400 fill-none'
            } transition-all duration-500 group-hover:stroke-red-700`}
            d="M30 20.5c-3.3-3.3-8.7-3.3-12 0-3.3 3.3-3.3 8.7 0 12L30 44.5l12-12c3.3-3.3 3.3-8.7 0-12-3.3-3.3-8.7-3.3-12 0z"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isAnimating && (
        <div className="absolute inset-0 animate-twinkle-ring pointer-events-none"></div>
      )}
    </div>
  );
};

AddToWhistListBtn.propTypes = {};

export default AddToWhistListBtn;
