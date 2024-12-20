import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import { formatCurrencyVND } from '~/utils/formatters';
import EmptyCart from './EmptyCart';
import PropTypes from 'prop-types';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { useUser } from '~/context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { removeCartToCurrent, updateCurrentUser } from '~/APIs';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';

const CartFixed = ({ open, setOpen }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    items: guestItems,
    removeItem,
    emptyCart,
    cartTotal: guestCartTotal,
  } = useCart();
  const { isAuthenticated } = useCheckAuth();
  const { user, refetchUser } = useUser();
  const [userCartItems, setUserCartItems] = useState([]);
  const [userCartTotal, setUserCartTotal] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.carts) {
      const updatedCartItems = user.carts.map((item) => ({
        ...item,
        id: item?._id || '',
        name: item?.name || 'Sản phẩm không xác định',
        image: item?.image || '',
        price: item?.price || 0,
        itemTotal: item?.itemTotal || 0,
        quantity: item?.quantity || 0,
        slug: item?.slug || '',
        variantColor: item?.variantColor || '',
        variantSize: item?.variantSize || 'FREESIZE'
      }));
      setUserCartItems(updatedCartItems);
      setUserCartTotal(
        user.carts.reduce((total, item) => total + (item?.itemTotal || 0), 0)
      );
    }
  }, [isAuthenticated, user]);

  const mutation = useMutation({
    mutationFn: removeCartToCurrent,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      refetchUser();
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
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

  const handleDeleteProduct = (cartId) => {
    if (isAuthenticated) {
      mutation.mutate({ _id: cartId });
    } else {
      removeItem(cartId);
      setShowTooltip(null);
    }
  };

  const toggleTooltip = (productId) => {
    if (showTooltip === productId) {
      setShowTooltip(null);
    } else {
      setShowTooltip(productId);
    }
  };

  const handleClearCart = () => {
    if (isAuthenticated) {
      emptyCartMutation({ carts: [] });
    } else {
      emptyCart();
    }
    setShowTooltip(null);
  };

  const items = isAuthenticated ? userCartItems : guestItems;
  const cartTotal = isAuthenticated ? userCartTotal : guestCartTotal;

  return (
    <Dialog
      className="relative z-[99999]"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:translate-x-full sm:duration-300"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl hide-scrollbar">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 hide-scrollbar">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Giỏ hàng
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Đóng</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : items.length === 0 ? (
                      <EmptyCart />
                    ) : (
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {items.map((product) => (
                            <li key={product.id} className="flex py-6 relative">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <NavLink to={`/san-pham/${product?.slug}`}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </NavLink>
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-gray-900">
                                  <h3>
                                    <NavLink
                                      to={`/san-pham/${product?.slug}`}
                                      className="text-clamp-2 font-medium text-base"
                                      title={product.name}
                                    >
                                      {product.name}
                                    </NavLink>
                                  </h3>
                                  <div>
                                    <p className="ml-4 font-medium text-base text-clamp-1">
                                      {formatCurrencyVND(product.price)}
                                    </p>
                                    <p className="text-right text-sm text-clamp-1">
                                      x {product.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 text-clamp-1">
                                  {product?.variantColor}
                                  {product?.variantSize !== 'FREESIZE' &&
                                    ` - ${product.variantSize}`}
                                </p>

                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p className="text-gray-500 text-clamp-1">
                                    Tổng:{' '}
                                    <b>
                                      {formatCurrencyVND(product.itemTotal)}
                                    </b>
                                  </p>

                                  <div className="flex relative">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => toggleTooltip(product.id)}
                                    >
                                      Xóa
                                    </button>

                                    {/* Tooltip xác nhận xóa */}
                                    {showTooltip === product.id && (
                                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white shadow-md border border-gray-200 px-4 py-3 rounded-md">
                                        <p className="text-sm mb-2 text-gray-700">
                                          Bạn có chắc muốn xóa?
                                        </p>
                                        <div className="flex justify-between mt-4">
                                          <button
                                            className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                            onClick={() =>
                                              toggleTooltip(product.id)
                                            }
                                          >
                                            Hủy
                                          </button>
                                          <button
                                            className="text-xs font-medium text-red-600 hover:text-red-800"
                                            onClick={() =>
                                              handleDeleteProduct(product.id)
                                            }
                                          >
                                            Đồng ý
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {items?.length > 2 && (
                          <button
                            className="btn rounded-md bg-red-500 text-white hover:bg-red-600 mt-8"
                            onClick={() => {
                              setOpen(false);
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
                                  } else {
                                    setOpen(true);
                                  }
                                });
                            }}
                          >
                            Xóa tất cả
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Tạm tính</p>
                      <p className="font-semibold text-xl text-red-600">
                        {formatCurrencyVND(cartTotal)}
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link
                        to={'/gio-hang'}
                        className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
                        onClick={() => setOpen(false)}
                      >
                        Xem giỏ hàng
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

CartFixed.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default CartFixed;
