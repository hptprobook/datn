import { Rating } from 'flowbite-react';

export default function ProductDetailReview({ reviews }) {
  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <div className="w-full">
          <h2 className="font-manrope font-bold text-2xl text-black mb-8 text-center">
            Đánh giá từ khách hàng
          </h2>
          <div className="pb-11 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto ">
            <div className="p-8 bg-amber-50 rounded-3xl flex items-center justify-center flex-col">
              <h2 className="font-manrope font-bold text-3xl text-amber-400 mb-6">
                {averageRating}
              </h2>
              {reviews.length > 0 && (
                <Rating className="mt-1 text-xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Rating.Star
                      key={i}
                      className={
                        i < averageRating ? 'text-yellow-600' : 'text-gray-300'
                      }
                      filled={i < averageRating}
                    />
                  ))}
                </Rating>
              )}
              <p className="font-medium text-md leading-8 text-gray-900 text-center">
                {reviews.length} Đánh giá
              </p>
            </div>
          </div>

          <div className="pt-11 pb-8 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto">
            <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://pagedone.io/asset/uploads/1704349572.png"
                  alt="John image"
                  className="w-8 h-8"
                />
                <h6 className="font-semibold text-md leading-8 text-indigo-600 ">
                  Phan Thanh Hóa
                </h6>
              </div>
              <p className="font-normal text-md leading-8 text-gray-400">
                01/07/2024
              </p>
            </div>
            <p className="font-normal text-base leading-8 text-gray-400 max-xl:text-justify">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Distinctio iure, laboriosam debitis, id, asperiores aliquid
              excepturi mollitia eos delectus error iusto dolore impedit
              sapiente. Laudantium, perferendis assumenda! Officia, beatae fuga.
            </p>
          </div>
        </div>
      </div>
      <div className="pagination flex justify-center">
        <button className="btn bg-white text-black">0</button>
        <button className="btn bg-white text-black btn-active">1</button>
        <button className="btn bg-white text-black">2</button>
        <button className="btn bg-white text-black">3</button>
        <button className="btn bg-white text-black">4</button>
      </div>
    </section>
  );
}
