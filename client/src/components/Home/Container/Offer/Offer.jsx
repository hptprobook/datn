import { useState } from 'react';
import { offerProducts } from '~/APIs/mock_data';
import ProductItem from '~/components/common/Product/ProductItem';

const Offer = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Bán chạy nhất', 'Siêu Hot', 'Giảm giá'];
  const tabContent = [
    offerProducts.bestSellers,
    offerProducts.hotDeals,
    offerProducts.discounts,
  ];

  return (
    <div className="mt-32 text-black">
      <h2 className="text-2xl text-center font-bold text-red-600">
        ƯU ĐÃI ĐỘC QUYỀN ONLINE
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
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-6 lg:px-0">
        {tabContent[activeTab].map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

Offer.propTypes = {};

export default Offer;
