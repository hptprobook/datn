import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCatSlug } from '~/APIs';
import ProductItem from '~/components/common/Product/ProductItem';

export default function CategoryContent({ catData }) {
  const [limit, setLimit] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching } = useQuery({
    queryKey: ['getProductsByCategorySlug', catData.slug, limit],
    queryFn: () => getProductsByCatSlug(catData.slug, limit),
    keepPreviousData: true,
  });

  const products = data || [];

  useEffect(() => {
    if (products.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [products.length, limit]);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 20);
  };

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">{catData.name} w0wStore</h2>
      <div className="divider"></div>

      {/* Sorting Form */}
      <div className="mb-8">
        <form className="flex space-x-4 items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sắp xếp theo:
          </label>
          <select className="select select-bordered w-full max-w-xs select-sm bg-white text-black">
            <option defaultValue>Mặc định</option>
            <option>Mới nhất</option>
            <option>Phổ biến</option>
            <option>Tên (từ A - Z )</option>
            <option>Tên (từ Z - A )</option>
            <option>Giá (từ cao - thấp )</option>
            <option>Giá (từ thấp - cao )</option>
          </select>
        </form>
      </div>

      {/* Products Grid */}
      <div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3 lg:px-0">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="w-full flex justify-center mt-8">
        {hasMore && (
          <button
            className="btn btn-error bg-red-600"
            onClick={handleLoadMore}
            disabled={isFetching}
          >
            {isFetching ? 'Đang tải...' : 'Xem thêm'}
            {!isFetching && <Icon icon="mdi:arrow-right" className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
}
