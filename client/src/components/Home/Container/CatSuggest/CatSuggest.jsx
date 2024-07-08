import { NavLink } from 'react-router-dom';
import { catSuggest } from '~/apis/mock_data';

export default function CatSuggest() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">
        MUA GÌ HÔM NAY?
      </h2>
      <div className="grid grid-cols-4 gap-4 lg:gap-10 sm:grid-cols-6 mt-6 lg:px-0">
        {catSuggest.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div className="relative w-full" style={{ paddingTop: '100%' }}>
              <NavLink to={'#'}>
                <img
                  src={item.imgURL}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                />
              </NavLink>
            </div>
            <p className="mt-2 text-center text-black font-medium">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
