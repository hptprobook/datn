import { Rating } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Star } from '~/components/common/Icon/Star';
import ImageViewer from 'react-simple-image-viewer';

const ProductDetailReview = ({ reviews }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortByNewest, setSortByNewest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const reviewsPerPage = 6;

  const openImageViewer = (imageUrls, index) => {
    setImages(imageUrls);
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  const filteredReviews = reviews
    .filter((review) =>
      selectedRating ? review.rating === selectedRating : true
    )
    .sort((a, b) =>
      sortByNewest ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const handleFilterStars = (star) => {
    setCurrentPage(1);
    setSelectedRating(star);
  };

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className='py-24 relative'>
      <div className='w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto'>
        <div className='w-full'>
          <h2 className='font-manrope font-bold text-2xl text-black mb-8 text-center'>
            Đánh giá từ khách hàng
          </h2>
          <div className='pb-11 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto '>
            <div className='p-8 bg-amber-50 rounded-3xl flex items-center justify-center flex-col'>
              <h2 className='font-manrope font-bold text-5xl text-red-600 mb-6'>
                {averageRating}
              </h2>
              <div className='flex items-center mb-5'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    filled={index < Math.round(averageRating)}
                  />
                ))}
              </div>
              <p className='font-medium text-md leading-8 text-gray-900 text-center'>
                ({reviews.length} Đánh giá)
              </p>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className='flex justify-between items-center mt-8 mb-4 overflow-x-auto'>
            <div className='flex gap-4'>
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-2 py-1 text-md rounded-lg ${
                  selectedRating === null
                    ? 'bg-red-500 text-amber-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span className='flex items-center gap-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                  Tất cả
                </span>
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => handleFilterStars(star)}
                  className={`px-2 py-1 rounded-lg flex items-center ${
                    selectedRating === star ? 'bg-red-500' : 'bg-gray-100'
                  }`}
                >
                  <Rating>
                    {Array.from({ length: star }).map((_, i) => (
                      <Rating.Star
                        key={i}
                        className={
                          selectedRating === star
                            ? 'text-amber-300'
                            : 'text-amber-500'
                        }
                      />
                    ))}
                  </Rating>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortByNewest(!sortByNewest)}
              className={`px-3 max-lg:ml-4 ml-0 py-1 rounded-lg flex items-center gap-1 ${
                sortByNewest ? 'bg-blue-500 text-white' : 'bg-red-500'
              }`}
            >
              {sortByNewest ? (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h8m-8 6h16'
                    />
                  </svg>
                  Mới nhất
                </>
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h8m-8 6h16m-8 6h8'
                    />
                  </svg>
                  Cũ nhất
                </>
              )}
            </button>
          </div>

          {/* Danh sách review */}
          {currentReviews?.length > 0 ? (
            currentReviews?.map((review) => (
              <div
                key={review?.orderId}
                className='pt-11 pb-8 border-b border-gray-100 max-xl:mx-auto'
              >
                <div className='flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4'>
                  <div className='flex items-center gap-3'>
                    {review?.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${
                          review?.avatar
                        }`}
                        alt={review?.username}
                        className='w-8 h-8 object-cover rounded-full'
                      />
                    ) : (
                      <img
                        src={`https://avatar.iran.liara.run/username?username=${review?.username}`}
                        alt={review?.username}
                        className='w-8 h-8 object-cover rounded-full'
                      />
                    )}
                    <div className='flex flex-col gap-1'>
                      <h6 className='font-semibold text-md leading-8 text-indigo-600'>
                        {review?.username}
                      </h6>
                      <Rating className='text-xl'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Rating.Star
                            key={i}
                            className={
                              i < review?.rating
                                ? 'text-amber-600'
                                : 'text-gray-300'
                            }
                            filled={i < review?.rating}
                          />
                        ))}
                      </Rating>
                    </div>
                  </div>
                  <p className='font-normal text-md leading-8 text-gray-400'>
                    {new Date(review?.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <p className='font-normal text-md leading-8 text-gray-700'>
                  Màu sắc: <strong>{review?.variantColor}</strong>
                </p>
                <p className='font-normal text-md leading-8 text-gray-700'>
                  Kích thước: <strong>{review?.variantSize}</strong>
                </p>
                {review?.images && review?.images?.length > 0 && (
                  <div className='flex flex-row gap-x-2 my-4'>
                    {review?.images?.map((image, index) => (
                      <img
                        key={index}
                        className='w-[70px] h-[70px] object-cover cursor-pointer'
                        src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                        onClick={() =>
                          openImageViewer(
                            review.images.map(
                              (img) =>
                                `${import.meta.env.VITE_SERVER_URL}/${img}`
                            ),
                            index
                          )
                        }
                      />
                    ))}
                  </div>
                )}
                <p className='font-normal text-base leading-8 text-gray-700 max-xl:text-justify'>
                  {review?.content}
                </p>
                {review?.shopResponse && (
                  <div className='p-4 max-xl:max-w-2xl max-xl:mx-auto bg-[#f5f5f5] rounded-md'>
                    <h6 className='font-semibold text-md leading-8 text-indigo-600'>
                      Phản hồi từ người bán:{' '}
                    </h6>
                    <p className='font-normal text-base leading-8 text-gray-700 max-xl:text-justify'>
                      {review?.shopResponse?.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='w-full py-16 text-center text-gray-900'>
              <svg
                className='mx-auto'
                xmlns='http://www.w3.org/2000/svg'
                width='154'
                height='161'
                viewBox='0 0 154 161'
                fill='none'
              >
                <path
                  d='M0.0616455 84.4268C0.0616455 42.0213 34.435 7.83765 76.6507 7.83765C118.803 7.83765 153.224 42.0055 153.224 84.4268C153.224 102.42 147.026 118.974 136.622 132.034C122.282 150.138 100.367 161 76.6507 161C52.7759 161 30.9882 150.059 16.6633 132.034C6.25961 118.974 0.0616455 102.42 0.0616455 84.4268Z'
                  fill='#EEF2FF'
                />
                <path
                  d='M96.8189 0.632498L96.8189 0.632384L96.8083 0.630954C96.2034 0.549581 95.5931 0.5 94.9787 0.5H29.338C22.7112 0.5 17.3394 5.84455 17.3394 12.4473V142.715C17.3394 149.318 22.7112 154.662 29.338 154.662H123.948C130.591 154.662 135.946 149.317 135.946 142.715V38.9309C135.946 38.0244 135.847 37.1334 135.648 36.2586L135.648 36.2584C135.117 33.9309 133.874 31.7686 132.066 30.1333C132.066 30.1331 132.065 30.1329 132.065 30.1327L103.068 3.65203C103.068 3.6519 103.067 3.65177 103.067 3.65164C101.311 2.03526 99.1396 0.995552 96.8189 0.632498Z'
                  fill='white'
                  stroke='#E5E7EB'
                />
                <ellipse
                  cx='80.0618'
                  cy='81'
                  rx='28.0342'
                  ry='28.0342'
                  fill='#EEF2FF'
                />
                <path
                  d='M99.2393 61.3061L99.2391 61.3058C88.498 50.5808 71.1092 50.5804 60.3835 61.3061C49.6423 72.0316 49.6422 89.4361 60.3832 100.162C71.109 110.903 88.4982 110.903 99.2393 100.162C109.965 89.4363 109.965 72.0317 99.2393 61.3061ZM105.863 54.6832C120.249 69.0695 120.249 92.3985 105.863 106.785C91.4605 121.171 68.1468 121.171 53.7446 106.785C39.3582 92.3987 39.3582 69.0693 53.7446 54.683C68.1468 40.2965 91.4605 40.2966 105.863 54.6832Z'
                  stroke='#E5E7EB'
                />
                <path
                  d='M110.782 119.267L102.016 110.492C104.888 108.267 107.476 105.651 109.564 102.955L118.329 111.729L110.782 119.267Z'
                  stroke='#E5E7EB'
                />
                <path
                  d='M139.122 125.781L139.122 125.78L123.313 109.988C123.313 109.987 123.313 109.987 123.312 109.986C121.996 108.653 119.849 108.657 118.521 109.985L118.871 110.335L118.521 109.985L109.047 119.459C107.731 120.775 107.735 122.918 109.044 124.247L109.047 124.249L124.858 140.06C128.789 143.992 135.191 143.992 139.122 140.06C143.069 136.113 143.069 129.728 139.122 125.781Z'
                  fill='#A5B4FC'
                  stroke='#818CF8'
                />
                <path
                  d='M83.185 87.2285C82.5387 87.2285 82.0027 86.6926 82.0027 86.0305C82.0027 83.3821 77.9987 83.3821 77.9987 86.0305C77.9987 86.6926 77.4627 87.2285 76.8006 87.2285C76.1543 87.2285 75.6183 86.6926 75.6183 86.0305C75.6183 80.2294 84.3831 80.2451 84.3831 86.0305C84.3831 86.6926 83.8471 87.2285 83.185 87.2285Z'
                  fill='#4F46E5'
                />
                <path
                  d='M93.3528 77.0926H88.403C87.7409 77.0926 87.2049 76.5567 87.2049 75.8946C87.2049 75.2483 87.7409 74.7123 88.403 74.7123H93.3528C94.0149 74.7123 94.5509 75.2483 94.5509 75.8946C94.5509 76.5567 94.0149 77.0926 93.3528 77.0926Z'
                  fill='#4F46E5'
                />
                <path
                  d='M71.5987 77.0925H66.6488C65.9867 77.0925 65.4507 76.5565 65.4507 75.8945C65.4507 75.2481 65.9867 74.7122 66.6488 74.7122H71.5987C72.245 74.7122 72.781 75.2481 72.781 75.8945C72.781 76.5565 72.245 77.0925 71.5987 77.0925Z'
                  fill='#4F46E5'
                />
                <rect
                  x='38.3522'
                  y='21.5128'
                  width='41.0256'
                  height='2.73504'
                  rx='1.36752'
                  fill='#4F46E5'
                />
                <rect
                  x='38.3522'
                  y='133.65'
                  width='54.7009'
                  height='5.47009'
                  rx='2.73504'
                  fill='#A5B4FC'
                />
                <rect
                  x='38.3522'
                  y='29.7179'
                  width='13.6752'
                  height='2.73504'
                  rx='1.36752'
                  fill='#4F46E5'
                />
                <circle cx='56.13' cy='31.0854' r='1.36752' fill='#4F46E5' />
                <circle cx='61.6001' cy='31.0854' r='1.36752' fill='#4F46E5' />
                <circle cx='67.0702' cy='31.0854' r='1.36752' fill='#4F46E5' />
              </svg>
              <p className='text-lg mt-5'>Không có đánh giá nào</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='pagination flex justify-center pt-11'>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn bg-white text-black ${
                    currentPage === index + 1 ? 'btn-active' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={currentImageIndex}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
      )}
    </section>
  );
};

ProductDetailReview.propTypes = {
  reviews: PropTypes.array,
};

export default ProductDetailReview;
