import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { getBestViewCategory } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { resolveUrl } from '~/utils/formatters';

const CatSuggest = () => {
  // Mutate lấy danh sách danh mục yêu thích nhất
  const { data: topViewCategories, isLoading } = useQuery({
    queryKey: ['getTopViewCategories'],
    queryFn: getBestViewCategory,
  });

  if (!topViewCategories) return null;

  const categories = topViewCategories || [];

  if (isLoading) return <MainLoading />;

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">
        MUA GÌ HÔM NAY?
      </h2>
      <div className="grid grid-cols-3 gap-4 lg:gap-10 sm:grid-cols-6 mt-6 lg:px-0">
        {categories?.length > 0 &&
          categories?.map((item) => (
            <div key={item?._id} className="flex flex-col items-center">
              <div className="relative w-full" style={{ paddingTop: '100%' }}>
                <NavLink to={`/danh-muc-san-pham/${item?.slug}`}>
                  <img
                    src={resolveUrl(item?.imageURL)}
                    alt={item?.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
                  />
                </NavLink>
              </div>
              <NavLink to={`/danh-muc-san-pham/${item?.slug}`}>
                <p
                  className="mt-2 text-center text-black font-medium hover:text-red-500 text-clamp-1"
                  title={item?.name}
                >
                  {item?.name}
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
