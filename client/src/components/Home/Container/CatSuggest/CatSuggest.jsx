import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllCategory } from '~/APIs';

function getRandomCategories(categories, count) {
  if (!Array.isArray(categories)) {
    return [];
  }

  const shuffled = categories.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function CatSuggest() {
  const [randomCategories, setRandomCategories] = useState([]);

  const { data } = useQuery({
    queryKey: ['getAllCategories'],
    queryFn: getAllCategory,
  });

  useEffect(() => {
    if (data) {
      const storedCategories = localStorage.getItem('randomCategories');
      const storedDate = localStorage.getItem('randomCategoriesDate');
      const today = new Date().toISOString().split('T')[0];

      if (storedCategories && storedCategories.length && storedDate === today) {
        setRandomCategories(JSON.parse(storedCategories));
      } else {
        const randomSelection = getRandomCategories(data?.categories, 12);
        localStorage.setItem(
          'randomCategories',
          JSON.stringify(randomSelection)
        );
        localStorage.setItem('randomCategoriesDate', today);
        setRandomCategories(randomSelection);
      }
    }
  }, [data]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">
        MUA GÌ HÔM NAY?
      </h2>
      <div className="grid grid-cols-4 gap-4 lg:gap-10 sm:grid-cols-6 mt-6 lg:px-0">
        {randomCategories.length > 0 &&
          randomCategories.map((item) => (
            <div key={item._id} className="flex flex-col items-center">
              <div className="relative w-full" style={{ paddingTop: '100%' }}>
                <NavLink to={`/danh-muc-san-pham/${item.slug}`}>
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                </NavLink>
              </div>
              <NavLink to={`/danh-muc-san-pham/${item.slug}`}>
                <p className="mt-2 text-center text-black font-medium">
                  {item.name}
                </p>
              </NavLink>
            </div>
          ))}
      </div>
    </div>
  );
}
