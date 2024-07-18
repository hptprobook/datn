import { useState } from 'react';
import './style.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function ProductDetailSlider({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div className="slider-box w-full h-full max-lg:mx-auto mx-0">
      <Swiper
        spaceBetween={10}
        loop={true}
        className="nav-for-slider"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="thumbs-slide">
            <img
              src={image}
              alt={`Summer Travel Bag image ${index + 1}`}
              className="cursor-pointer rounded-md transition-all duration-500"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        slidesPerView={4}
        spaceBetween={10}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-slide-carousel h-auto"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="block">
              <img
                src={image}
                alt="Summer Travel Bag image"
                className="max-lg:mx-auto"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
