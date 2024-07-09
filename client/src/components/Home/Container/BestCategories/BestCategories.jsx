import { useState } from 'react';
import ProductItem from '~/components/common/Product/ProductItem';

export default function BestCategories({ item }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Nam', 'Nữ', 'Trẻ em'];

  const filteredProducts = item.products.filter((product) => {
    if (activeTab === 0) return product.type === 'male';
    if (activeTab === 1) return product.type === 'female';
    if (activeTab === 2) return product.type === 'child';
    return false;
  });

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600 uppercase">
        {item.title}
      </h2>
      <div className="flex justify-center mt-6">
        <div className="flex space-x-6">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`uppercase font-semibold cursor-pointer pb-2 ${
                activeTab === index
                  ? 'border-b-2 border-red-600'
                  : 'border-b-2 border-transparent'
              } transition-all duration-300`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      <div className="my-5 w-full h-64 overflow-hidden">
        <img src={item.img} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductItem key={product.id} product={product} height={true} />
        ))}
      </div>
    </div>
  );
}
