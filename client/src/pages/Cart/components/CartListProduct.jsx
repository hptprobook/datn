import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ChangeQuantity from '~/components/common/ButtonGroup/ChangeQuantity';
import { FaTrashAlt } from 'react-icons/fa';

export default function CartListProduct() {
  const [quantity, setQuantity] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleCheckItem = (index) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      if (newCheckedItems.includes(index)) {
        newCheckedItems.splice(newCheckedItems.indexOf(index), 1);
      } else {
        newCheckedItems.push(index);
      }
      return newCheckedItems;
    });
  };

  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems([0, 1, 2]);
    }
    setCheckAll(!checkAll);
  };

  const products = [
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
    {
      name: 'Balo nam',
      details: 'Đỏ, XXL',
      price: '360.000 đ',
      imgSrc: 'https://pagedone.io/asset/uploads/1701162850.png',
    },
  ];

  return (
    <div className="col-span-12 xl:col-span-8 lg:pr-8 pb-8 w-full max-xl:max-w-3xl max-xl:mx-auto">
      <div className="block text-center lg:text-left  lg:flex items-center justify-between pb-8 border-b border-gray-300">
        <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
          Giỏ hàng
        </h2>
        <h2 className="font-manrope font-bold text-md leading-8 text-gray-600">
          Số sản phẩm đã chọn: {checkedItems.length}/{products.length}
        </h2>
      </div>
      <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            className="checkbox-error checkbox bg-white"
            defaultChecked
            checked={checkAll}
            onChange={handleCheckAll}
          />
        </div>
        <div className="col-span-5 md:col-span-4">
          <p className="font-normal text-lg leading-8 text-gray-400">
            Sản phẩm
          </p>
        </div>
        <div className="col-span-6 md:col-span-7">
          <div className="grid grid-cols-5">
            <div className="col-span-4">
              <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                Số lượng
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-normal text-lg leading-8 text-gray-400 text-right">
                Tổng tiền
              </p>
            </div>
          </div>
        </div>
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group"
        >
          <div className="flex items-center justify-center md:justify-start">
            <input
              type="checkbox"
              className="checkbox-error checkbox bg-white hover:bg-white"
              defaultChecked
              checked={checkedItems.includes(index)}
              onChange={() => handleCheckItem(index)}
            />
          </div>
          <div className="w-full md:max-w-[126px]">
            <img src={product.imgSrc} alt="product image" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 w-full">
            <div className="md:col-span-4">
              <div className="flex flex-col max-[500px]:items-center gap-3">
                <NavLink to={'/'}>
                  <h6 className="font-semibold text-base leading-7 text-black hover:text-red-600 cursor-pointer">
                    {product.name}
                  </h6>
                </NavLink>
                <h6 className="font-normal text-base leading-7 text-gray-500">
                  {product.details}
                </h6>
                <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-amber-600">
                  {product.price}
                </h6>
              </div>
            </div>
            <div className="flex items-center h-full max-md:mt-3 md:col-span-5">
              <ChangeQuantity
                onChange={handleQuantityChange}
                quantity={quantity}
              />
            </div>
            <div className="flex items-center justify-center md:justify-end max-md:mt-3 h-full md:col-span-3">
              <div className="flex items-center flex-col">
                <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-amber-600">
                  {product.price}
                </p>
                <FaTrashAlt className="text-gray-600 cursor-pointer hover:text-red-600 transition-all duration-300 mt-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
