import { useQuery } from '@tanstack/react-query';
import { Link, NavLink } from 'react-router-dom';
import { getAllBlogAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';

export default function Post() {
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllBlogAPI,
  });

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  if (isLoading) return <MainLoading />;

  const firstPost = blogData?.reduce(
    (max, post) => (post?.view > max?.view ? post : max),
    blogData[0]
  );

  const otherPosts = blogData
    ?.filter((post) => post !== firstPost)
    ?.slice(0, 4);

  // Xây dựng URL cho thumbnail của firstPost
  const firstPostThumbnailUrl =
    firstPost?.thumbnail?.startsWith('http://') ||
    firstPost?.thumbnail?.startsWith('https://')
      ? firstPost?.thumbnail
      : `${serverUrl}/${firstPost?.thumbnail}`;

  if (isLoading) return <MainLoading />;

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">TIN TỨC</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 lg:h-post">
        <div>
          <div className="w-full h-96">
            <NavLink to={`/tin-tuc/${firstPost?.slug}`}>
              <img
                src={firstPostThumbnailUrl}
                alt={firstPost?.title}
                className="w-full h-full object-cover"
              />
            </NavLink>
          </div>
          <p className="text-black font-semibold text-md mt-3 hover:text-red-600 text-clamp-2">
            <NavLink to={`/tin-tuc/${firstPost?.slug}`}>
              {firstPost?.title}
            </NavLink>
          </p>
          <p className="text-slate-700 font-normal text-sm mt-1 text-clamp-3">
            {firstPost?.shortDesc}
          </p>
        </div>
        <div className="h-full lg:overflow-hidden">
          {otherPosts.map((post) => {
            const postImgUrl =
              post?.thumbnail?.startsWith('http://') ||
              post?.thumbnail?.startsWith('https://')
                ? post?.thumbnail
                : `${serverUrl}/${post?.thumbnail}`; // URL đầy đủ cho img

            return (
              <div
                key={post?._id}
                className="flex lg:h-1/4 pb-2 border-b-2 mb-2 last:border-0 h-36"
              >
                <div className="w-44 flex-shrink-0">
                  <NavLink to={`/tin-tuc/${post?.slug}`}>
                    <img
                      src={postImgUrl} // URL đầy đủ cho img của post
                      alt={post?.title}
                      className="w-full h-full object-cover"
                    />
                  </NavLink>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-black font-semibold text-md hover:text-red-600 text-clamp-2">
                    <NavLink to={`/tin-tuc/${post?.slug}`}>
                      {post?.title}
                    </NavLink>
                  </p>
                  <p className="text-slate-700 font-normal text-sm mt-1 text-clamp-3">
                    {post?.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-6">
        <Link
          to={'/tin-tuc'}
          className="btn rounded-md px-4 bg-red-500 text-white hover:bg-red-700"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
}
