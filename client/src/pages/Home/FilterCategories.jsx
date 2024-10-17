import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getProductsByEventSlug } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import ProductItem from '~/components/common/Product/ProductItem';

const FilterCategories = ({ slug }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['getBestCategoriesProduct', slug],
    queryFn: () => getProductsByEventSlug(slug),
  });

  const tabs = ['Nam', 'Nữ', 'Trẻ em'];

  if (isLoading) return <MainLoading />;

  // Depending on the active tab, select the appropriate product category
  let filteredProducts = [];
  if (activeTab === 0) filteredProducts = data.nam || [];
  if (activeTab === 1) filteredProducts = data.nu || [];
  if (activeTab === 2) filteredProducts = data.treEm || [];

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600 uppercase">
        {slug}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductItem key={product._id} product={product} height={true} />
        ))}
      </div>
    </div>
  );
};

FilterCategories.propTypes = {};

export default FilterCategories;
