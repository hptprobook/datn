import { useEffect, useState } from 'react';
import './style.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageViewer from 'react-simple-image-viewer';

export default function ProductDetailSlider({ images, activeIndex }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(activeIndex || 0);

  useEffect(() => {
    if (mainSwiper && activeIndex !== null) {
      mainSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, mainSwiper]);

  // Function to open image viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  // Function to close image viewer
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div className="slider-box w-full h-[602px] max-lg:mx-auto mx-0 z-10">
      {/* Swiper chính */}
      <Swiper
        onSwiper={setMainSwiper}
        spaceBetween={0}
        loop={false}
        className="nav-for-slider"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="thumbs-slide">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="cursor-pointer rounded-md transition-all duration-500"
              onClick={() => openImageViewer(index)} // Open image viewer on click
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper cho các ảnh nhỏ dùng để chọn */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={false} // Vô hiệu hóa loop để tránh tràn
        slidesPerView={4}
        spaceBetween={10}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-slide-carousel h-auto max-h-[150px] overflow-hidden" // Giới hạn chiều cao
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="mt-3">
            <div className="block">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="max-lg:mx-auto cursor-pointer rounded-md transition-all duration-500 aspect-square"
                onClick={() => openImageViewer(index)} // Open image viewer on thumbnail click
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Image Viewer */}
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={currentImageIndex}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
}
