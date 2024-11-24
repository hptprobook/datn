import { Icon } from '@iconify/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { getBlogBySlugAPI, getTopViewBlogAPI, updateViewBlog } from '~/APIs';
import { convertHTMLToText, formatDateToDDMMYYYY } from '~/utils/formatters';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: topViewPosts } = useQuery({
    queryKey: ['getTopViewBlog'],
    queryFn: getTopViewBlogAPI,
  });

  const increaseView = useMutation({
    mutationFn: updateViewBlog,
  });

  const { data: blogDetail } = useQuery({
    queryKey: ['getBlogBySLug', slug],
    queryFn: () => getBlogBySlugAPI({ slug }),
  });

  useEffect(() => {
    if (!blogDetail?._id) return;

    const viewTimeout = setTimeout(() => {
      increaseView.mutate({ id: blogDetail._id });
    }, 3000);

    return () => clearTimeout(viewTimeout);
  }, [slug, blogDetail?._id]);

  return (
    <div className="max-w-container mx-auto p-4 ">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-9/12 px-4 ">
          <h2 className="text-3xl font-bold mb-4 uppercase text-gray-900">
            {blogDetail?.title}
          </h2>
          <div className="text-slate-400 flex items-center font-bold mb-2">
            <Icon icon="solar:calendar-bold" />
            <span className="ml-2">
              {formatDateToDDMMYYYY(blogDetail?.createdAt)}
            </span>
          </div>
          <div>
            <p className="text-gray-600 italic my-5 text-xl">
              {convertHTMLToText(blogDetail?.shortDesc)}
            </p>
          </div>
          <div className="text-xl text-gray-700 leading-loose">
            {convertHTMLToText(blogDetail?.content)}
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
          <h2 className="text-xl font-bold mb-8 text-gray-900 uppercase">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {blogDetail?.tags?.map((tag) => (
              <div
                key={tag.tag}
                onClick={() => navigate(`/tin-tuc?tags=${tag}`)}
                className="badge badge-secondary px-3 py-1 cursor-pointer"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

PostDetail.propTypes = {};

export default PostDetail;
