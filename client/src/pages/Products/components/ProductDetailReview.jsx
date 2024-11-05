import { Rating } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ProductDetailReview = ({ reviews }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortByNewest, setSortByNewest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const repeatedReviews = Array(3).fill(reviews).flat();

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  const filteredReviews = repeatedReviews
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
              <h2 className='font-manrope font-bold text-3xl text-amber-400 mb-6'>
                {averageRating}
              </h2>
              {reviews.length > 0 && <div>Rating</div>}
              <p className='font-medium text-md leading-8 text-gray-900 text-center'>
                {reviews.length} Đánh giá
              </p>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className='flex justify-between items-center mt-8 mb-4'>
            <div className='flex gap-4'>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => handleFilterStars(star)}
                  className={`px-3 py-1 rounded-lg ${
                    selectedRating === star
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {star} Sao
                </button>
              ))}
              <button
                onClick={() => setSelectedRating(null)}
                className='px-3 py-1 bg-gray-200 rounded-lg'
              >
                Tất cả
              </button>
            </div>
            <button
              onClick={() => setSortByNewest(!sortByNewest)}
              className='px-3 py-1 bg-gray-100 rounded-lg'
            >
              {sortByNewest ? 'Mới nhất' : 'Cũ nhất'}
            </button>
          </div>

          {/* Danh sách review */}
          {currentReviews.map((review) => (
            <div
              key={review.orderId}
              className='pt-11 pb-8 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto'
            >
              <div className='flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4'>
                <div className='flex items-center gap-3'>
                  {review.avatar ? (
                    <img
                      src={`http://localhost:3000/${review.avatar}`}
                      alt={review.username}
                      className='w-8 h-8 object-cover rounded-full'
                    />
                  ) : (
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${review.username}`}
                      alt={review.username}
                      className='w-8 h-8 object-cover rounded-full'
                    />
                  )}
                  <div className='flex flex-col gap-1'>
                    <h6 className='font-semibold text-md leading-8 text-indigo-600'>
                      {review.username}
                    </h6>
                    <Rating className='text-xl'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Rating.Star
                          key={i}
                          className={
                            i < review.rating
                              ? 'text-yellow-600'
                              : 'text-gray-300'
                          }
                          filled={i < review.rating}
                        />
                      ))}
                    </Rating>
                  </div>
                </div>
                <p className='font-normal text-md leading-8 text-gray-400'>
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <p className='font-normal text-md leading-8 text-gray-400'>
                Color: <strong>{review.variantColor}</strong>
              </p>
              <p className='font-normal text-md leading-8 text-gray-400'>
                Size: <strong>{review.variantSize}</strong>
              </p>
              {review.images && review.images.length > 0 && (
                <div className='flex flex-row gap-x-2 my-4'>
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      className='w-[70px] h-[70px] object-cover'
                      src={`http://localhost:3000/${image}`}
                    />
                  ))}
                </div>
              )}
              <p className='font-normal text-base leading-8 text-gray-400 max-xl:text-justify'>
                {review.content}
              </p>
              {review.shopResponse && (
                <div className='p-4 max-xl:max-w-2xl max-xl:mx-auto bg-[#f5f5f5] rounded-md'>
                  <h6 className='font-semibold text-md leading-8 text-indigo-600'>
                    Shop response
                  </h6>
                  <p className='font-normal text-base leading-8 text-gray-400 max-xl:text-justify'>
                    {review.shopResponse.content}
                  </p>
                </div>
              )}
            </div>
          ))}

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
    </section>
  );
};

ProductDetailReview.propTypes = {
  reviews: PropTypes.array,
};

export default ProductDetailReview;
