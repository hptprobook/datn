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
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <div className="w-full">
          <h2 className="font-manrope font-bold text-2xl text-black mb-8 text-center">
            Đánh giá từ khách hàng
          </h2>
          <div className="pb-11 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto ">
            <div className="p-8 bg-amber-50 rounded-3xl flex items-center justify-center flex-col">
              <h2 className="font-manrope font-bold text-5xl text-red-600 mb-6">
                {averageRating}
              </h2>
              <div className="flex items-center mb-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    filled={index < Math.round(averageRating)}
                  />
                ))}
              </div>
              <p className="font-medium text-md leading-8 text-gray-900 text-center">
                ({reviews.length} Đánh giá)
              </p>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="flex justify-between items-center mt-8 mb-4">
            <div className="flex gap-4">
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
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-2 py-1 text-md rounded-lg ${
                  selectedRating === null
                    ? 'bg-red-500 text-amber-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Tất cả
                </span>
              </button>
            </div>
            <button
              onClick={() => setSortByNewest(!sortByNewest)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                sortByNewest ? 'bg-blue-500 text-white' : 'bg-red-500'
              }`}
            >
              {sortByNewest ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                  Mới nhất
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h8m-8 6h16m-8 6h8"
                    />
                  </svg>
                  Cũ nhất
                </>
              )}
            </button>
          </div>

          {/* Danh sách review */}
          {currentReviews?.map((review) => (
            <div
              key={review?.orderId}
              className="pt-11 pb-8 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto"
            >
              <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4">
                <div className="flex items-center gap-3">
                  {review?.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${
                        review?.avatar
                      }`}
                      alt={review?.username}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${review?.username}`}
                      alt={review?.username}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <h6 className="font-semibold text-md leading-8 text-indigo-600">
                      {review?.username}
                    </h6>
                    <Rating className="text-xl">
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
                <p className="font-normal text-md leading-8 text-gray-400">
                  {new Date(review?.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <p className="font-normal text-md leading-8 text-gray-700">
                Màu sắc: <strong>{review?.variantColor}</strong>
              </p>
              <p className="font-normal text-md leading-8 text-gray-700">
                Kích thước: <strong>{review?.variantSize}</strong>
              </p>
              {review?.images && review?.images?.length > 0 && (
                <div className="flex flex-row gap-x-2 my-4">
                  {review?.images?.map((image, index) => (
                    <img
                      key={index}
                      className="w-[70px] h-[70px] object-cover cursor-pointer"
                      src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                      onClick={() =>
                        openImageViewer(
                          review.images.map(
                            (img) => `${import.meta.env.VITE_SERVER_URL}/${img}`
                          ),
                          index
                        )
                      }
                    />
                  ))}
                </div>
              )}
              <p className="font-normal text-base leading-8 text-gray-700 max-xl:text-justify">
                {review?.content}
              </p>
              {review?.shopResponse && (
                <div className="p-4 max-xl:max-w-2xl max-xl:mx-auto bg-[#f5f5f5] rounded-md">
                  <h6 className="font-semibold text-md leading-8 text-indigo-600">
                    Phản hồi từ người bán:{' '}
                  </h6>
                  <p className="font-normal text-base leading-8 text-gray-700 max-xl:text-justify">
                    {review?.shopResponse?.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination flex justify-center pt-11">
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
