import UserAddress from './UserAddress';
import CheckoutProduct from './CheckoutProduct';
import CheckoutFinal from './CheckoutFinal';
import { useState } from 'react';
import { useUser } from '~/context/UserContext';
import ProductItem from '~/components/common/Product/ProductItem';

const LoggedOrder = ({ selectedProducts }) => {
  const [userAddress, setUserAddress] = useState(null);
  const { user } = useUser();
  const productsViewed = user ? user?.views : [];
  const favoriteProducts = user ? user?.favorites : [];

  return (
    <div>
      <UserAddress userAddress={userAddress} setUserAddress={setUserAddress} />
      <CheckoutProduct selectedProducts={selectedProducts} />
      <CheckoutFinal
        userAddress={userAddress}
        selectedProducts={selectedProducts}
      />
      <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold uppercase">Sản phẩm đã xem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {productsViewed.map((item) => (
            <div key={item._id} className="relative">
              <ProductItem product={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="text-gray-900 mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold uppercase">Sản phẩm yêu thích</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {favoriteProducts.map((item) => (
            <div key={item._id} className="relative">
              <ProductItem product={item} isWishList={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

LoggedOrder.propTypes = {};

export default LoggedOrder;
