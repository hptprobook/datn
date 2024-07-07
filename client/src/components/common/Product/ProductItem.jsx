import { Rating } from 'flowbite-react';
import ProductLabelBadge from '../Badge/ProductLabelBadge';
import { NavLink } from 'react-router-dom';

export default function ProductItem({ product, height = false }) {
  return (
    <div className="h-productItem">
      <NavLink to="">
        <div className={`w-full relative ${!height ? 'h-80' : 'h-96'}`}>
          <div className="flex gap-2 absolute top-2 left-2">
            {product.label.map((label, index) => (
              <ProductLabelBadge key={index} text={label} />
            ))}
          </div>
          <img
            src={product.img}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </NavLink>
      <NavLink to="">
        <div className="mt-3 text-clamp-2">{product.title}</div>
      </NavLink>
      <Rating className="mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Rating.Star
            key={i}
            className={i < product.rate ? 'text-yellow-600' : 'text-gray-300'}
            filled={i < product.rate}
          />
        ))}
        <p className="text-sm">(19)</p>
      </Rating>
      <div className="mt-3 font-bold text-sm">
        {new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'VND',
        }).format(product.price)}
      </div>
    </div>
  );
}
