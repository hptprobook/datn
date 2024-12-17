/* eslint-disable react/no-unescaped-entities */
import { NavLink } from 'react-router-dom';
import CatSuggest from '~/components/Home/Container/CatSuggest/CatSuggest';
import HeaderSlider from '~/components/Home/Slider/HeaderSlider';
import FilterCategories from './FilterCategories';
import { useWebConfig } from '~/context/WebsiteConfig';
import Post from '~/components/Home/Container/Post/Post';
import { env } from '~/utils/constants';

const HomePage = () => {
  const eventCategories = ['ao-polo', 'ao-somi', 'quan-short'];
  const { config } = useWebConfig();

  return (
    <>
      <main className="z-0 max-w-container mx-auto px-2 lg:px-0 text-black">
        <HeaderSlider />
        <CatSuggest />
        {eventCategories?.map((item, i) => (
          <FilterCategories key={i} slug={item} />
        ))}
        <Post />
        <div className="banner mt-24 w-full md:h-slider">
          <NavLink to={config?.eventUrl}>
            <img
              src={`${env.SERVER_URL}/${config?.eventBanner}`}
              className="w-full h-full object-cover"
              alt=""
            />
          </NavLink>
        </div>
      </main>
      <div className="hidden md:flex h-productItem bg-red-800 mt-12 w-full flex-col items-center justify-center">
        <div>
          <img
            src={`${env.SERVER_URL}/${config?.logo}`}
            className="h-48 object-cover"
            alt=""
          />
        </div>
        <div className="2xl:px-102 xl:px-80 lg:px-40 md:px-10 sm:px-3 text-white text-center italic">
          <p className="text-xl font-bold">
            "Cảm ơn quý khách hàng đã tin tưởng và ủng hộ cho{' '}
            {config?.nameCompany}"
          </p>
          <div
            className="text-white mt-2 font-light"
            dangerouslySetInnerHTML={{ __html: config?.footerThanks }}
          />
        </div>
      </div>
    </>
  );
};

HomePage.propTypes = {};

export default HomePage;
