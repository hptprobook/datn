import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAllBlogAPI, getTopViewBlogAPI } from '~/APIs';
import { formatDateToDDMMYYYY } from '~/utils/formatters';

const PostPage = () => {
  const [limit, setLimit] = useState(12);
  const { data: posts } = useQuery({
    queryKey: ['getAllBlogs', limit],
    queryFn: () => getAllBlogAPI({ limit }),
  });

  const { data: topViewPosts } = useQuery({
    queryKey: ['getTopViewBlog'],
    queryFn: getTopViewBlogAPI,
  });

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 12);
  };

  return (
    <div className="max-w-container mx-auto">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-9/12 px-4">
          <h2 className="text-xl font-bold mb-8 text-gray-900 uppercase">
            Tin hot nhất
          </h2>
          <div className="hotNewsSwiper grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts?.map((post) => (
              <div
                key={post?._id}
                className="bg-white p-4 rounded shadow border"
              >
                <NavLink to={`/tin-tuc/${post?.slug}`}>
                  <img
                    src={post?.thumbnail}
                    alt={post?.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </NavLink>
                <div className="mt-5">
                  <div className="text-sm text-gray-500 flex gap-3">
                    {post?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-success rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <NavLink to={`/tin-tuc/${post?.slug}`}>
                    <h2 className="text-xl font-bold my-4 text-clamp-2 h-16 hover:text-red-600 text-gray-800">
                      {post?.title}
                    </h2>
                  </NavLink>
                  <p className="h-18 text-clamp-3 text-gray-600">
                    {post?.shortDesc}
                  </p>
                  <div className="text-sm text-gray-500 mt-4">
                    <p>Ngày đăng: {formatDateToDDMMYYYY(post?.createdAt)}</p>
                    <p>Người đăng: {post?.author}</p>
                    <p>Số lượt xem: {post?.views}</p>
                  </div>
                  <Link
                    to={`/tin-tuc/${post?.slug}`}
                    className="btn mt-4 text-white hover:bg-blue-700 btn-primary rounded-md "
                  >
                    Xem ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center my-12">
            <button
              onClick={handleLoadMore}
              className="btn bg-red-600 text-white hover:bg-red-700 rounded-md"
            >
              Xem thêm
            </button>
          </div>
        </div>

        <div className="w-full lg:w-3/12 px-4 mt-4 lg:mt-0">
          <h2 className="text-xl font-bold mb-8 text-gray-900 uppercase">
            Đáng xem
          </h2>
          {topViewPosts?.map((post) => (
            <div
              key={post?._id}
              className="bg-white p-4 rounded shadow mb-4 border"
            >
              <NavLink to={`/tin-tuc/${post?.slug}`}>
                <img
                  src={post?.thumbnail}
                  alt={post?.title}
                  className="w-full h-24 mb-3 object-cover rounded"
                />
              </NavLink>
              <NavLink to={`/tin-tuc/${post?.slug}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-red-600 text-gray-800">
                  {post?.title}
                </h2>
              </NavLink>
              <p className="text-gray-600 mb-2">{post?.shortDesc}</p>
              <Link
                to={`/tin-tuc/${post?.slug}`}
                className="mt-2 text-blue-500 hover:text-red-600"
              >
                Xem ngay
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PostPage.propTypes = {};

export default PostPage;
