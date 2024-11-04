import ProductItem from '~/components/common/Product/ProductItem';
import { useUser } from '~/context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProductViewed = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useUser();
  const productsViewed = user?.views || [];

  useEffect(() => {
    refetchUser();
  }, [navigate]);

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">SẢN PHẨM ĐÃ XEM</h1>

      {productsViewed.length === 0 ? (
        <div className="flex flex-col items-center mt-8 text-center text-gray-600">
          <p className="text-lg">Bạn chưa xem sản phẩm nào.</p>
          <Link
            to="/"
            className="text-red-600 font-semibold mt-2 hover:underline"
          >
            Đi xem ngay &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {productsViewed.map((item) => (
            <div key={item._id} className="relative">
              <ProductItem product={item} isWishList={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductViewed;
