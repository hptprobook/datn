import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllWebBanner } from '~/APIs';
import { resolveUrl } from '~/utils/formatters';

const HeaderSlider = () => {
  // Mutate lấy web banner
  const { data: webBanner, isLoading } = useQuery({
    queryKey: ['websiteBanner'],
    queryFn: getAllWebBanner,
  });

  if (!webBanner) return null;

  if (isLoading) return null;

  const slider = webBanner || [];

  return (
    <div className="w-full h-slider z-0">
      <Swiper
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper z-0"
      >
        {slider.map((item) => (
          <SwiperSlide key={item?._id} className="z-0">
            <NavLink to={item?.url}>
              <img
                src={resolveUrl(item?.image)}
                alt={item?.title}
                className="w-full h-full object-cover"
              />
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

HeaderSlider.propTypes = {};

export default HeaderSlider;
