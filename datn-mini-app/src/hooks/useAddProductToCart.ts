import { useRecoilState } from "recoil";
import { useCallback } from "react";
import { CartProduct } from "../models";
import { cartState } from "../state";

const useAddProductToCart = () => {
  const [cart, setCart] = useRecoilState(cartState);
  return useCallback(
    ({ productOrder }: { productOrder: CartProduct }) => {
      setCart((oldCart) => {
        const cart = { ...oldCart };
        const orderIndex = cart.listOrder.findIndex(
          (prod) => prod._id === productOrder._id
        );
        if (orderIndex >= 0) {
          // available in cart
          if (productOrder.order.quantity === 0) {
            // delete product in cart
            cart.listOrder = cart.listOrder.filter((_, index) => index !== orderIndex);
          } else {
            cart.listOrder = cart.listOrder.map((item, index) =>
              index === orderIndex ? { ...item, order: productOrder.order } : item
            );
          }
        } else if (productOrder.order.quantity > 0) {
          cart.listOrder = [...cart.listOrder, { ...productOrder }];
        }
        cart.date = new Date();
        return cart;
      });
    },
    [setCart]
  );
};

export default useAddProductToCart;