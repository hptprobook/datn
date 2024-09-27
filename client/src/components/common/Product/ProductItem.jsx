import { Rating } from 'flowbite-react';
import ProductLabelBadge from '../Badge/ProductLabelBadge';
import { NavLink } from 'react-router-dom';

const ProductItem = ({ product, height = false }) => {
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  // Calculate the average rating from product.reviews[].rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="h-productItem rounded-md">
      <NavLink to={`/san-pham/${product.slug}`}>
        <div className={`w-full relative ${!height ? 'h-80' : 'h-96'}`}>
          <div className="flex gap-2 absolute top-2 left-2">
            {product.tags.slice(0, 2).map((label, index) => (
              <ProductLabelBadge key={index} text={label} />
            ))}
          </div>
          <img
            src={product.thumbnail}
            alt=""
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </NavLink>
      <NavLink to={`/san-pham/${product.slug}`}>
        <div
          className="mt-3 text-clamp-2 hover:text-red-500"
          title={product.name}
        >
          {product.name}
        </div>
      </NavLink>
      {reviews.length > 0 && (
        <Rating className="mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Rating.Star
              key={i}
              className={
                i < averageRating ? 'text-yellow-600' : 'text-gray-300'
              }
              filled={i < averageRating}
            />
          ))}
          <p className="text-sm">({reviews.length})</p>
        </Rating>
      )}
      <div className="mt-3 font-bold text-sm">
        {new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'VND',
        }).format(product.price)}
      </div>
    </div>
  );
};

export default ProductItem;
