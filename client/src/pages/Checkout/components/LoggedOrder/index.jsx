import UserAddress from './UserAddress';
import CheckoutProduct from './CheckoutProduct';
import CheckoutFinal from './CheckoutFinal';
import { useState } from 'react';

const LoggedOrder = ({ selectedProducts }) => {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <div>
      <UserAddress userAddress={userAddress} setUserAddress={setUserAddress} />
      <CheckoutProduct selectedProducts={selectedProducts} />
      <CheckoutFinal
        userAddress={userAddress}
        selectedProducts={selectedProducts}
      />
    </div>
  );
};

LoggedOrder.propTypes = {};

export default LoggedOrder;
