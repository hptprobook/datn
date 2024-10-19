import { useState } from 'react';
import { Rating } from 'flowbite-react';
import ProductLabelBadge from '../Badge/ProductLabelBadge';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '~/APIs/product';
import QuickViewModal from './QuickViewModal';
import { FaEye, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '~/context/WishListContext';

const ProductItem = ({ product, height = false, isLoading = false }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: fullProductData, isLoading: isProductLoading } = useQuery({
    queryKey: ['getProductById', product?._id],
    queryFn: () => getProductById(product?._id),
    enabled: isQuickViewOpen,
  });

  if (isLoading) {
    return (
      <div className={'h-[400px] rounded-md'}>
        <div className="skeleton h-full w-full"></div>
        <div className="skeleton h-4 w-full mt-2"></div>
        <div className="skeleton h-4 w-3/4 mt-2"></div>
        <div className="skeleton h-4 w-1/2 mt-2"></div>
      </div>
    );
  }

  if (!product) return null;

  const thumbnailUrl =
    product.thumbnail.startsWith('https://') ||
    product.thumbnail.startsWith('http://') ||
    product.thumbnail.startsWith('//')
      ? product.thumbnail
      : `${import.meta.env.VITE_SERVER_URL}/${product.thumbnail}`;

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
  };

  return (
    <div className="h-[480px] rounded-md relative group">
      <div className={`w-full relative ${!height ? 'h-80' : 'h-96'}`}>
        <Link to={`/san-pham/${product?.slug}`}>
          <div className="flex gap-2 absolute top-2 left-2 z-10">
            {product?.tags?.slice(0, 2).map((label, index) => (
              <ProductLabelBadge key={index} text={label} />
            ))}
          </div>
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            onClick={() => setIsQuickViewOpen(true)}
            title="Quick View"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            className={`${
              isInWishlist(product._id) ? 'bg-red-600' : 'bg-red-500'
            } text-white p-2 rounded-full hover:bg-red-600 transition-colors ${
              isHeartAnimating ? 'scale-125' : ''
            }`}
            onClick={handleWishlistToggle}
            title={
              isInWishlist(product._id)
                ? 'Remove from Wishlist'
                : 'Add to Wishlist'
            }
          >
            <FaHeart
              className={`w-4 h-4 transition-transform duration-300 ${
                isHeartAnimating ? 'scale-125' : ''
              }`}
            />
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            onClick={() => setIsQuickViewOpen(true)}
            title="Add to Cart"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
      <NavLink to={`/san-pham/${product?.slug}`}>
        <div
          className="mt-3 text-clamp-2 hover:text-red-500 h-12 overflow-hidden"
          title={product?.name}
        >
          {product?.name}
        </div>
      </NavLink>
      {product?.totalComment > 0 && (
        <Rating className="mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Rating.Star
              key={i}
              className={
                i < product?.averageRating ? 'text-yellow-600' : 'text-gray-300'
              }
              filled={i < product?.averageRating}
            />
          ))}
          <p className="text-sm">({product?.totalComment})</p>
        </Rating>
      )}
      <div className="mt-3 font-bold text-sm">
        {new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'VND',
        }).format(product?.price)}
      </div>
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={fullProductData}
        isLoading={isProductLoading}
      />
    </div>
  );
};

export default ProductItem;
