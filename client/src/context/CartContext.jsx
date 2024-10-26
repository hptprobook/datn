/* eslint-disable */

import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [stockErrors, setStockErrors] = useState([]);
  const [isDebouncing, setDebouncing] = useState(false);

  const updateSelectedTotal = (items, selectedItems) => {
    if (items && selectedItems) {
      const total = items
        .filter((item) => selectedItems.includes(item.id))
        .reduce((acc, item) => acc + item.itemTotal, 0);
      setSelectedTotal(total);
    }
  };

  const value = {
    selectedItems,
    setSelectedItems,
    selectedTotal,
    updateSelectedTotal,
    stockErrors,
    setStockErrors,
    isDebouncing,
    setDebouncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(CartContext);
};
