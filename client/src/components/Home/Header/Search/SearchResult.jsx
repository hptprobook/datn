import { FaFire } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { productSearchList } from '~/apis/mock_data';
import ProductItem from '~/components/common/Product/ProductItem';

export default function SearchResult({ handleModelClick }) {
  return (
    <div className="w-full bg-yellow-50" onClick={handleModelClick}>
      <div className="max-w-container mx-auto">
        <div className="flex gap-3 items-center py-6">
          <FaFire className="text-red-500" />
          <p className="font-bold">Tìm kiếm gợi ý</p>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-5">
          {productSearchList.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
        <NavLink
          to={'#'}
          className="flex justify-end items-center gap-2 text-red-500 pb-6 font-medium"
        >
          Xem tất cả <FaArrowRightLong />
        </NavLink>
      </div>
    </div>
  );
}
