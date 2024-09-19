import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getAllProducts } from '~/APIs';
import ProductItem from '~/components/common/Product/ProductItem';

export default function CategoryContent({ catData }) {
  const { data } = useQuery({
    queryKey: ['getAllProduct'],
    queryFn: getAllProducts,
  });

  const products = data?.products || null;

  useEffect(() => {
    console.log('🚀 ~ ProductItem ~ product:', products);
  }, [products]);

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">{catData.name} w0wStore</h2>
      <div className="divider"></div>
      <div className="mb-8">
        {/* Sorting Form */}
        <form className="flex space-x-4 items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sắp xếp theo:
          </label>
          <select className="select select-bordered w-full max-w-xs select-sm bg-white text-black">
            <option selected>Mặc định</option>
            <option>Mới nhất</option>
            <option>Phổ biến</option>
            <option>Tên (từ A - Z )</option>
            <option>Tên (từ Z - A )</option>
            <option>Giá (từ cao - thấp )</option>
            <option>Giá (từ thấp - cao )</option>
          </select>
        </form>
      </div>

      {/* Content */}
      <div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3 lg:px-0">
          {products?.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
