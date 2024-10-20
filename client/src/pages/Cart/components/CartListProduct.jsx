import { useCart } from 'react-use-cart';
import { useEffect } from 'react';
import { formatCurrencyVND } from '~/utils/formatters';
import { Icon } from '@iconify/react';
import QuantityButton from '~/components/common/ButtonGroup/QuantityButton';
import { useCartContext } from '~/context/CartContext';
import { Link } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';

const CartListProduct = () => {
  const { items, updateItemQuantity, removeItem } = useCart();
  const { selectedItems, setSelectedItems } = useCartContext();
  const { isAuthenticated } = useCheckAuth();

  useEffect(() => {
    setSelectedItems(items.map((item) => item.id));
  }, [items]);

  const handleItemClick = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    useSwalWithConfirm
      .fire({
        title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
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
          removeItem(id);
          useSwal.fire(
            'Đã xoá!',
            'Sản phẩm đã được xoá khỏi giỏ hàng.',
            'success'
          );
        }
      });
  };

  return (
    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl cursor-pointer relative">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Giỏ hàng
        </h2>
        <h6 className="text-md font-semibold text-gray-900">
          Đã chọn: {selectedItems.length} sản phẩm
        </h6>
      </div>
      <div className="space-y-6">
        {items.map((product) => (
          <div
            key={product.id}
            className={`relative rounded-lg border p-4 shadow-sm ${
              selectedItems.includes(product.id)
                ? 'border-red-500'
                : 'border-gray-200'
            } bg-white`}
            onClick={() => handleItemClick(product.id)}
          >
            {selectedItems.includes(product.id) && (
              <Icon
                icon="mage:check"
                className="absolute top-2 right-2 text-red-600"
                width="30"
                height="30"
              />
            )}
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
              <a
                href="#"
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
                    handleQuantityChange(product.id, newQuantity)
                  }
                  stopPropagation={(e) => e.stopPropagation()}
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
                  {product?.variantColor} - {product?.variantSize}
                </p>

                <div className="flex items-center gap-4">
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
                      onClick={(e) => e.stopPropagation()}
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
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                        />
                      </svg>
                    </button>
                  )}

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
        ))}
      </div>
    </div>
  );
};

export default CartListProduct;
