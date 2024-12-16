import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AddToWhistListBtn from '~/components/common/Button/AddToWhistList';
import RateInforBtn from '~/components/common/Button/RateInfor';
import SelectColor from './SelectColor';
import SelectSize from './SelectSize';
import ChangeQuantity from '~/components/common/ButtonGroup/ChangeQuantity';
import AddToCartBtn from '~/components/common/Button/AddToCart';
import { formatCurrencyVND } from '~/utils/formatters';
import { useCart } from 'react-use-cart';
import CartFixed from '~/components/Home/Header/CartFixed';
import PropTypes from 'prop-types';
import { useUser } from '~/context/UserContext';
import useCheckAuth from '~/customHooks/useCheckAuth';
import { useMutation } from '@tanstack/react-query';
import { addCartToCurrent } from '~/APIs';
import ObjectID from 'bson-objectid';
import { useSwal } from '~/customHooks/useSwal';

const ProductDetailInfor = ({
  product,
  onColorChange,
  isQuickView = false,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const { isAuthenticated } = useCheckAuth();
  const { refetchUser } = useUser();
  const [error, setError] = useState('');
  const [openCartFixed, setOpenCartFixed] = useState(false);
  const { addItem, items } = useCart();

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * selectedPrice);
  };

  const sizes =
    selectedColor !== null
      ? product?.variants?.find((variant) => variant.color === selectedColor)
          ?.sizes
      : [];

  const isFreeSize = sizes.length === 1 && sizes[0].size === 'FREESIZE';
  if (isFreeSize && selectedSize !== 'FREESIZE') {
    setSelectedSize('FREESIZE');
  }

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(isFreeSize ? 'FREESIZE' : null);
    const selectedVariant = product.variants.find(
      (variant) => variant.color === color
    );

    if (selectedVariant) {
      setSelectedPrice(selectedVariant.price);
      setTotalPrice(quantity * selectedVariant.price);
    }

    onColorChange(color);
  };

  const selectedVariant = product.variants.find(
    (variant) => variant.color === selectedColor
  );

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    const selectedSizeObj = selectedVariant?.sizes?.find(
      (s) => s.size === size
    );

    if (selectedSizeObj) {
      setSelectedPrice(selectedSizeObj.price || selectedVariant.price);
      setTotalPrice(
        quantity * (selectedSizeObj.price || selectedVariant.price)
      );

      selectedVariant.sku = selectedSizeObj.sku
        ? selectedSizeObj.sku + (size === 'FREESIZE' ? 'FREESIZE' : '')
        : selectedVariant.sku;
    }
  };

  const handleAddProductToCart = (onSuccessCallback) => {
    if (!selectedColor || (sizes?.length > 0 && !isFreeSize && !selectedSize)) {
      setError('Vui lòng chọn đầy đủ màu sắc và kích thước.');
    } else {
      setError('');

      const cartItem = {
        productId: product._id,
        name: product.name,
        weight: product.weight,
        price: selectedPrice,
        slug: product.slug,
        sku: isFreeSize
          ? selectedVariant.sku + 'FREESIZE'
          : selectedVariant.sku,
        image: selectedVariant.image,
        variantColor: selectedColor,
        variantSize: isFreeSize ? 'FREESIZE' : selectedSize,
        quantity,
      };

      if (isAuthenticated) {
        mutation.mutate(cartItem, {
          onSuccess: () => {
            if (onSuccessCallback) onSuccessCallback();
            refetchUser();
            setOpenCartFixed(true);
            resetSelections(); // Đặt lại màu sắc và kích thước sau khi thêm vào giỏ hàng
          },
        });
      } else {
        const existingItem = items.find(
          (item) =>
            item.slug === product.slug &&
            item.variantColor === selectedColor &&
            item.variantSize === (isFreeSize ? 'FREESIZE' : selectedSize)
        );

        if (existingItem) {
          addItem(existingItem, quantity);
        } else {
          const cartId = ObjectID(Date.now()).toString();
          addItem(
            {
              id: cartId,
              productId: product._id,
              name: product.name,
              weight: product.weight,
              price: selectedPrice,
              slug: product.slug,
              sku: isFreeSize
                ? selectedVariant.sku + 'FREESIZE'
                : selectedVariant.sku,
              image: selectedVariant.image,
              variantColor: selectedColor,
              variantSize: isFreeSize ? 'FREESIZE' : selectedSize,
            },
            quantity
          );
        }

        setOpenCartFixed(true);
        resetSelections(); // Đặt lại màu sắc và kích thước sau khi thêm vào giỏ hàng

        if (onSuccessCallback) onSuccessCallback();
      }
    }
  };

  const resetSelections = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    setSelectedPrice(product.price);
    setTotalPrice(product.price);
  };

  const mutation = useMutation({
    mutationFn: addCartToCurrent,
    onSuccess: () => {
      refetchUser();
      setOpenCartFixed(true);
    },
    onError: () => {
      useSwal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Xảy ra lỗi khi thêm sản phẩm vào giỏ hàng, vui lòng thử lại!',
      });
    },
  });

  const handleAddToCart = () => {
    handleAddProductToCart();
  };

  const handleBuyNow = () => {
    if (!selectedColor || (sizes?.length > 0 && !isFreeSize && !selectedSize)) {
      setError('Vui lòng chọn màu sắc - kích thước.');
    } else {
      setError('');
      handleAddProductToCart(() => {
        navigate('/gio-hang');
      });
    }
  };

  return (
    <div className="flex justify-center items-center text-black">
      <div className="pro-detail w-full lg:pl-8 xl:pl-16 max-lg:mx-auto lg:mt-8 mt-32 max-sm:mt-16">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="text">
            {!isQuickView ? (
              <h2 className="font-manrope font-bold text-xl leading-10 text-gray-900 mb-2 text-clamp-3">
                {product?.name}
              </h2>
            ) : (
              <NavLink to={`/san-pham/${product?.slug}`}>
                <h2 className="font-manrope font-bold text-xl leading-10 text-gray-900 mb-2 text-clamp-3 hover:text-red-600">
                  {product?.name}
                </h2>
              </NavLink>
            )}

            {product?.statusStock === 'outStock' && (
              <span className="badge badge-error my-3 text-xs rounded-md">
                Hết hàng
              </span>
            )}

            {product?.statusStock === 'preOrder' && (
              <>
                <span className="badge badge-warning my-3 text-xs rounded-md">
                  Đang về hàng
                </span>
                <p className="text-xs text-gray-500 mb-3 text-red-600">
                  Hãy liên hệ shop để đặt hàng đang về kho!
                </p>
              </>
            )}

            <p className="font-normal text-base text-gray-500 text-clamp-1">
              SKU: {selectedVariant?.sku || product?.variants[0].sku}
            </p>
          </div>
          {isAuthenticated && <AddToWhistListBtn product={product} />}
        </div>
        <div className="flex gap-5 flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
          <div className="flex items-center">
            <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 ">
              {formatCurrencyVND(totalPrice)}
            </h5>
          </div>
          <RateInforBtn rate={4.5} />
        </div>

        <p className="font-medium text-lg text-gray-900 mb-2">Màu sắc</p>
        <SelectColor
          variants={product.variants}
          onChange={handleColorChange}
          selectedColor={selectedColor}
        />

        {!isFreeSize && sizes && sizes.length > 0 && (
          <>
            <p className="font-medium text-lg text-gray-900 mb-2">Kích thước</p>
            <SelectSize
              sizes={sizes}
              onChange={handleSizeChange}
              selectedSize={selectedSize}
            />
          </>
        )}

        {error && <p className="text-red-600 mb-5">{error}</p>}

        <div className="flex items-center flex-col min-[400px]:flex-row gap-3 mb-3 min-[400px]:mb-8">
          <ChangeQuantity
            onChange={handleQuantityChange}
            quantity={quantity}
            setQuantity={setQuantity}
          />
          <AddToCartBtn
            disabled={
              product?.statusStock === 'outStock' ||
              product?.statusStock === 'preOrder'
            }
            isPending={mutation.isPending}
            onClick={handleAddToCart}
          />
        </div>
        <button
          className="text-center w-full px-5 py-4 rounded-md bg-red-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-red-700 hover:shadow-red-300 disabled:bg-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed"
          onClick={handleBuyNow}
          disabled={
            product?.statusStock === 'outStock' ||
            product?.statusStock === 'preOrder'
          }
        >
          Mua ngay
        </button>
      </div>
      <CartFixed open={openCartFixed} setOpen={setOpenCartFixed} />
    </div>
  );
};

ProductDetailInfor.propTypes = {
  product: PropTypes.object.isRequired,
  onColorChange: PropTypes.func,
};

export default ProductDetailInfor;
