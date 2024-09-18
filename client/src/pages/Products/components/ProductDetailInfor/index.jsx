import AddToWhistListBtn from '~/components/common/Button/AddToWhistList';
import RateInforBtn from '~/components/common/Button/RateInfor';
import SelectColor from './SelectColor';
import SelectSize from './SelectSize';
import ChangeQuantity from '~/components/common/ButtonGroup/ChangeQuantity';
import AddToCartBtn from '~/components/common/Button/AddToCart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryById } from '~/APIs';
import { useQuery } from '@tanstack/react-query';

export default function ProductDetailInfor({ product }) {
  const { data, isLoading } = useQuery({
    queryKey: ['getCategoryById'],
    queryFn: () => getCategoryById(product?.cat_id),
  });

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  if (isLoading) return null;

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  console.log('🚀 ~ data:', data);
  return (
    <div className="flex justify-center items-center text-black">
      <div className="pro-detail w-full max-lg:max-w-[608px] lg:pl-8 xl:pl-16 max-lg:mx-auto max-lg:mt-8">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="text">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2">
              {product?.name}
            </h2>
            <p className="font-normal text-base text-gray-500">Danh mục</p>
          </div>
          <AddToWhistListBtn />
        </div>
        <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
          <div className="flex items-center">
            <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 ">
              399.999 đ{' '}
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
          {/* Star rate product button */}
          <RateInforBtn rate={4.5} />
        </div>
        <p className="font-medium text-lg text-gray-900 mb-2">Màu sắc</p>
        <SelectColor />
        <p className="font-medium text-lg text-gray-900 mb-2">Kích thước</p>
        <SelectSize />
        <div className="flex items-center flex-col min-[400px]:flex-row gap-3 mb-3 min-[400px]:mb-8">
          <ChangeQuantity onChange={handleQuantityChange} quantity={quantity} />
          <AddToCartBtn />
        </div>
        <button
          className="text-center w-full px-5 py-4 rounded-md bg-red-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-red-700 hover:shadow-red-300"
          onClick={() => {
            navigate('/gio-hang');
          }}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
