import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AddToWhistListBtn from '~/components/common/Button/AddToWhistList';
import RateInforBtn from '~/components/common/Button/RateInfor';
import SelectColor from './SelectColor';
import SelectSize from './SelectSize';
import ChangeQuantity from '~/components/common/ButtonGroup/ChangeQuantity';
import AddToCartBtn from '~/components/common/Button/AddToCart';
import { formatCurrencyVND, generateMongoObjectId } from '~/utils/formatters';
import { useCart } from 'react-use-cart';
import { handleToast } from '~/customHooks/useToast';
import CartFixed from '~/components/Home/Header/CartFixed';
import PropTypes from 'prop-types';
import { useWishlist } from '~/context/WishListContext';

const ProductDetailInfor = ({
  product,
  onColorChange,
  isQuickView = false,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Các state quản lý biến thể sản phẩm
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const [totalPrice, setTotalPrice] = useState(product.price);

  // State quản lý lỗi không chọn variant trước khi mua
  const [error, setError] = useState('');

  // State mở cart khi thêm vào giỏ hàng
  const [openCartFixed, setOpenCartFixed] = useState(false);

  // React-use-cart để thêm vào giỏ hàng không cần đăng nhập
  const { addItem, items } = useCart();

  // Hàm thay đổi số lượng sản phẩm muốn mua
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * selectedPrice); // Cập nhật giá tổng khi thay đổi số lượng
  };

  // Lấy sizes dựa trên kích thước đã chọn
  const sizes =
    selectedColor !== null
      ? product?.variants?.find((variant) => variant.color === selectedColor)
          ?.sizes
      : [];

  // Hàm thay đổi màu sắc khi chọn
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset lại kích thước khi chọn màu mới

    const selectedVariant = product.variants.find(
      (variant) => variant.color === color
    );

    if (selectedVariant) {
      setSelectedPrice(selectedVariant.price);
      setTotalPrice(quantity * selectedVariant.price); // Cập nhật giá tổng dựa trên số lượng và giá mới
    }

    onColorChange(color);
  };

  const selectedVariant = product.variants.find(
    (variant) => variant.color === selectedColor
  );

  // Hàm thay đổi kích thước khi chọn
  const handleSizeChange = (size) => {
    setSelectedSize(size);

    const selectedSizeObj = selectedVariant?.sizes.find((s) => s.size === size);

    if (selectedSizeObj && selectedSizeObj.price) {
      setSelectedPrice(selectedSizeObj.price);
      setTotalPrice(quantity * selectedSizeObj.price); // Cập nhật giá tổng dựa trên số lượng và giá kích thước mới
    } else {
      setSelectedPrice(selectedVariant.price);
      setTotalPrice(quantity * selectedVariant.price); // Cập nhật giá tổng nếu kích thước không có giá riêng
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setError('Vui lòng chọn đầy đủ màu sắc và kích thước.');
    } else {
      setError('');

      const selectedVariant = product.variants.find(
        (variant) => variant.color === selectedColor
      );

      const existingItem = items.find(
        (item) =>
          item.slug === product.slug &&
          item.variantColor === selectedColor &&
          item.variantSize === selectedSize
      );

      if (existingItem) {
        addItem(existingItem, quantity);
      } else {
        const cartId = generateMongoObjectId();

        addItem(
          {
            id: cartId,
            productId: product._id,
            name: product.name,
            weight: product.weight,
            price: selectedPrice,
            slug: product.slug,
            image: selectedVariant.image,
            variantColor: selectedColor,
            variantSize: selectedSize,
          },
          quantity
        );
      }

      handleToast('success', 'Sản phẩm đã được thêm vào giỏ hàng');
      setOpenCartFixed(true);
    }
  };

  const { isInWishlist } = useWishlist();

  return (
    <div className="flex justify-center items-center text-black">
      <div className="pro-detail w-full max-lg:max-w-[608px] lg:pl-8 xl:pl-16 max-lg:mx-auto max-lg:mt-8">
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
            <p className="font-normal text-base text-gray-500 text-clamp-1">
              SKU: {selectedVariant?.sku || product?.variants[0].sku}
            </p>
          </div>
          <AddToWhistListBtn
            product={product}
            isInWishlist={isInWishlist(product._id)}
          />
        </div>
        <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
          <div className="flex items-center">
            <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 ">
              {formatCurrencyVND(totalPrice)}{' '}
              {/* Hiển thị tổng giá dựa trên số lượng */}
            </h5>
            <span className="ml-3 font-semibold text-lg text-indigo-600">
              - 30%
            </span>
          </div>
          <svg
            className="mx-5 max-[400px]:hidden"
            xmlns="http://www.w3.org/2000/svg"
            width="2"
            height="36"
            viewBox="0 0 2 36"
            fill="none"
          >
            <path d="M1 0V36" stroke="#E5E7EB" />
          </svg>
          <RateInforBtn rate={4.5} />
        </div>

        {/* Màu sắc */}
        <p className="font-medium text-lg text-gray-900 mb-2">Màu sắc</p>
        <SelectColor
          variants={product.variants}
          onChange={handleColorChange}
          selectedColor={selectedColor}
        />

        {/* Kích thước */}
        {sizes && sizes.length > 0 && (
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
              !selectedSize ||
              sizes.find((size) => size.name === selectedSize)?.stock === 0
            }
            onClick={handleAddToCart}
          />
        </div>
        <button
          className="text-center w-full px-5 py-4 rounded-md bg-red-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-red-700 hover:shadow-red-300"
          onClick={() => {
            navigate('/gio-hang');
          }}
          disabled={
            !selectedSize ||
            sizes.find((size) => size.name === selectedSize)?.stock === 0
          }
        >
          Mua ngay
        </button>
      </div>
      {/* Modal CartFixed */}
      <CartFixed open={openCartFixed} setOpen={setOpenCartFixed} />
    </div>
  );
};

ProductDetailInfor.propTypes = {
  product: PropTypes.object.isRequired,
  onColorChange: PropTypes.func,
};

export default ProductDetailInfor;
