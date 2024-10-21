/* eslint-disable */

import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  const updateSelectedTotal = (items, selectedItems) => {
    const total = items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.itemTotal, 0);
    setSelectedTotal(total);
  };

  const value = {
    selectedItems,
    setSelectedItems,
    selectedTotal,
    updateSelectedTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(CartContext);
};
