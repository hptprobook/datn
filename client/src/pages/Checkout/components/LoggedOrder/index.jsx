import UserAddress from './UserAddress';
import CheckoutProduct from './CheckoutProduct';
import CheckoutFinal from './CheckoutFinal';

const LoggedOrder = () => {
  return (
    <div>
      <UserAddress />
      <CheckoutProduct />
      <CheckoutFinal />
    </div>
  );
};

LoggedOrder.propTypes = {};

export default LoggedOrder;
