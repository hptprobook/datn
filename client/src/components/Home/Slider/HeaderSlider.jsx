import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { slider } from '~/apis/mock_data';
import { NavLink } from 'react-router-dom';

export default function HeaderSlider() {
  return (
    <div className="w-full h-slider z-0">
      <Swiper
        autoplay={{
          delay: 5000,
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
          <SwiperSlide key={item.id} className="z-0">
            <NavLink to={item.productLink}>
              <img src={item.imgURL} alt={item.title} />
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
