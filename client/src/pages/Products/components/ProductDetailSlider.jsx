import { useEffect, useState } from 'react';
import './style.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageViewer from 'react-simple-image-viewer';
import PropTypes from 'prop-types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ProductDetailSlider = ({ images, activeIndex }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(activeIndex || 0);

  useEffect(() => {
    if (mainSwiper && activeIndex !== null) {
      mainSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, mainSwiper]);

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
    window.dispatchEvent(new CustomEvent('previewOpen', { detail: true }));
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    window.dispatchEvent(new CustomEvent('previewOpen', { detail: false }));
  };

  return (
    <div className="slider-box w-full h-[720px] max-lg:mx-auto mx-0 z-10 relative">
      {/* Main Swiper */}
      <Swiper
        onSwiper={setMainSwiper}
        spaceBetween={0}
        loop={false}
        className="nav-for-slider"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs]}
        onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="thumbs-slide">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="cursor-pointer rounded-md transition-all duration-500 object-cover h-full w-full"
              onClick={() => openImageViewer(index)} // Keep this for main images
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <div className="thumbnail-container">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={false}
          slidesPerView={4}
          spaceBetween={10}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="main-slide-carousel h-auto max-h-[150px] overflow-hidden"
          navigation={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="mt-3">
              <div
                className={`block thumbnail-wrapper ${
                  index === currentImageIndex ? 'active-thumbnail' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="max-lg:mx-auto cursor-pointer rounded-md transition-all duration-500 aspect-square"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Image Viewer */}
      {isViewerOpen && (
        <div>
          <ImageViewer
            src={images}
            currentIndex={currentImageIndex}
            disableScroll={true}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
            backgroundStyle={{
              zIndex: 10000000,
            }}
          />
        </div>
      )}
    </div>
  );
};

ProductDetailSlider.propTypes = {
  images: PropTypes.array.isRequired,
  activeIndex: PropTypes.number,
};

export default ProductDetailSlider;
