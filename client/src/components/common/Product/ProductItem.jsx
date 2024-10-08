import { Rating } from 'flowbite-react';
import ProductLabelBadge from '../Badge/ProductLabelBadge';
import { NavLink } from 'react-router-dom';

const ProductItem = ({ product, height = false }) => {
  if (!product) return null;

  const thumbnailUrl =
    product.thumbnail.startsWith('https://') ||
    product.thumbnail.startsWith('http://') ||
    product.thumbnail.startsWith('//')
      ? product.thumbnail
      : `${import.meta.env.VITE_SERVER_URL}/${product.thumbnail}`;

  return (
    <div className="h-productItem rounded-md">
      <NavLink to={`/san-pham/${product?.slug}`}>
        <div className={`w-full relative ${!height ? 'h-80' : 'h-96'}`}>
          <div className="flex gap-2 absolute top-2 left-2">
            {product?.tags?.slice(0, 2).map((label, index) => (
              <ProductLabelBadge key={index} text={label} />
            ))}
          </div>
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </NavLink>
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
    </div>
  );
};

export default ProductItem;
