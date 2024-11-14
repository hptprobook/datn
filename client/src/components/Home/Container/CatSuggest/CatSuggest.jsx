import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { getBestViewCategory } from '~/APIs';

const CatSuggest = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['getTopViewCategory'],
    queryFn: getBestViewCategory,
  });

  if (isLoading) return null;

  const categories = data || [];

  const getValidImageURL = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `${import.meta.env.VITE_SERVER_URL}/${url}`;
    }
    return url;
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">
        MUA GÌ HÔM NAY?
      </h2>
      <div className="grid grid-cols-3 gap-4 lg:gap-10 sm:grid-cols-6 mt-6 lg:px-0">
        {categories.length > 0 &&
          categories.map((item) => (
            <div key={item._id} className="flex flex-col items-center">
              <div className="relative w-full" style={{ paddingTop: '100%' }}>
                <NavLink to={`/danh-muc-san-pham/${item.slug}`}>
                  <img
                    src={getValidImageURL(item.imageURL)}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
                  />
                </NavLink>
              </div>
              <NavLink to={`/danh-muc-san-pham/${item.slug}`}>
                <p
                  className="mt-2 text-center text-black font-medium hover:text-red-500 text-clamp-1"
                  title={item.name}
                >
                  {item.name}
                </p>
              </NavLink>
            </div>
          ))}
      </div>
    </div>
  );
};

CatSuggest.propTypes = {};

export default CatSuggest;
