import { useCart } from 'react-use-cart';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrencyVND } from '~/utils/formatters';
import QuantityButton from '~/components/common/ButtonGroup/QuantityButton';
import { useCartContext } from '~/context/CartContext';
import { Link } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import { useUser } from '~/context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { removeCartToCurrent, updateCurrentUser } from '~/APIs';
import EmptyCart from '~/components/Home/Header/EmptyCart';

const CartListProduct = () => {
  const {
    items: guestItems,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();
  const {
    selectedItems,
    setSelectedItems,
    stockErrors,
    updateSelectedTotal,
    setDebouncing,
  } = useCartContext();
  const { isAuthenticated } = useCheckAuth();
  const [selectAll, setSelectAll] = useState(false);
  const [stockErrorStates, setStockErrorStates] = useState({});
  const { user, refetchUser } = useUser();

  const cartItems = isAuthenticated
    ? user?.carts.map((item) => ({ ...item, id: item._id }))
    : guestItems;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    updateSelectedTotal(cartItems, selectedItems);
  }, [selectedItems, cartItems]);

  const handleItemClick = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const debounceTimeout = useRef(null);

  const debouncedUpdateCart = useCallback(
    (updatedCart) => {
      setDebouncing(true);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        updateCurrentUser({ carts: updatedCart })
          .then(() => refetchUser())
          .catch(() => {
            useSwal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Cập nhật số lượng thất bại, vui lòng thử lại!',
            });
          })
          .finally(() => {
            setDebouncing(false);
          });
      }, 1500);
    },
    [refetchUser]
  );

  const handleQuantityChange = (product, newQuantity) => {
    if (isAuthenticated) {
      const updatedCart = user.carts.map((item) =>
        item._id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              itemTotal: newQuantity * item.price,
            }
          : item
      );
      debouncedUpdateCart(updatedCart);
    } else {
      updateItemQuantity(product.id, newQuantity);
    }
  };

  const findStockError = (id) => {
    return stockErrors.find((error) => error.id === id);
  };

  const handleStockError = (id, hasError) => {
    setStockErrorStates((prevStates) => ({
      ...prevStates,
      [id]: hasError,
    }));
  };

  const { mutate: deleteCart } = useMutation({
    mutationFn: removeCartToCurrent,
    onSuccess: () => {
      refetchUser();
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Xảy ra lỗi khi xoá sản phẩm khỏi giỏ hàng, vui lòng thử lại!',
      });
    },
  });

  const { mutate: emptyCartMutation } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      refetchUser();
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Xảy ra lỗi khi xoá tất cả sản phẩm khỏi giỏ hàng, vui lòng thử lại!',
      });
    },
  });

  const handleRemoveItem = (id) => {
    useSwalWithConfirm
      .fire({
        title: 'Xoá sản phẩm này khỏi giỏ hàng?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (isAuthenticated) {
            deleteCart({ _id: id });
          } else {
            removeItem(id);
          }
        }
      });
  };

  const handleClearCart = () => {
    if (isAuthenticated) {
      emptyCartMutation({ carts: [] });
    } else {
      emptyCart();
    }
  };

  const items = isAuthenticated ? user?.carts : guestItems;

  return (
    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl cursor-pointer relative">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Giỏ hàng
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="checkbox h-5 w-5 text-red-600"
            id="check-all"
          />
          <label
            htmlFor="check-all"
            className="text-md font-semibold text-gray-900 cursor-pointer"
          >
            Chọn tất cả
          </label>
        </div>

        <h6 className="text-md font-semibold text-gray-900 hidden lg:block">
          Đã chọn: {selectedItems.length} sản phẩm
        </h6>
      </div>
      <div className="space-y-6">
        {cartItems && cartItems.length ? (
          cartItems.map((product) => {
            const stockError = findStockError(product.id);
            const stockLimit = stockError
              ? stockError.availableQuantity
              : Infinity;
            const hasStockError = stockErrorStates[product.id];
            return (
              <div
                key={product.id}
                className={`relative rounded-lg border-2 p-4 shadow-sm ${
                  hasStockError
                    ? 'border-red-600'
                    : selectedItems.includes(product.id)
                    ? 'border-green-600'
                    : 'border-gray-200'
                } bg-white`}
                onClick={() => handleItemClick(product.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id)}
                  className="checkbox checkbox-success absolute top-2 right-2 h-5 w-5 text-red-600"
                />

                {stockError && (
                  <p
                    className={`absolute right-2 bottom-2 text-sm ${
                      hasStockError
                        ? 'text-red-600'
                        : selectedItems.includes(product.id)
                        ? 'text-white'
                        : 'border-gray-200'
                    }`}
                  >
                    {`Chỉ còn ${stockError.availableQuantity} sản phẩm trong kho.`}
                  </p>
                )}

                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <a
                    href={`/san-pham/${product.slug}`}
                    className="shrink-0 md:order-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      className="h-28 w-20 object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </a>

                  <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <QuantityButton
                      quantity={product.quantity}
                      onQuantityChange={(newQuantity) =>
                        handleQuantityChange(product, newQuantity)
                      }
                      stopPropagation={(e) => e.stopPropagation()}
                      stockLimit={stockLimit}
                      setHasStockError={(hasError) =>
                        handleStockError(product.id, hasError)
                      }
                    />

                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrencyVND(product.itemTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
                    <Link
                      to={`/san-pham/${product.slug}`}
                      className="text-base font-medium text-gray-900 hover:underline hover:text-red-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.name}
                    </Link>

                    <p className="text-gray-900 mt-0 pt-0">
                      {formatCurrencyVND(product.price)}
                    </p>

                    <p className="text-gray-900 mt-0 pt-0">
                      {product?.variantColor}
                      {product?.variantSize !== 'FREESIZE' &&
                        ` - ${product.variantSize}`}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(product.id);
                        }}
                      >
                        <svg
                          className="me-1.5 h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18 17.94 6M18 18 6.06 6"
                          />
                        </svg>
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyCart />
        )}
      </div>

      {items?.length > 2 && (
        <button
          className="btn rounded-md bg-red-500 text-white hover:bg-red-600 mt-8"
          onClick={() => {
            useSwalWithConfirm
              .fire({
                title: 'Xóa tất cả',
                text: 'Bắn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
                icon: 'warning',
                confirmButtonText: 'Xoá tất cả',
                cancelButtonText: 'Hủy',
              })
              .then((result) => {
                if (result.isConfirmed) {
                  handleClearCart();
                  useSwal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa tất cả sản phẩm thành công',
                    timer: 1500,
                  });
                }
              });
          }}
        >
          Xóa tất cả
        </button>
      )}
    </div>
  );
};

export default CartListProduct;
