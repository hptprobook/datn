import { NavLink } from 'react-router-dom';
import { posts } from '~/apis/mock_data';

export default function Post() {
  const firstPost = posts[0];
  const otherPosts = posts.slice(1, 5); // Lấy 4 bài còn lại

  return (
    <div className="mt-12">
      <h2 className="text-2xl text-center font-bold text-red-600">TIN TỨC</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 lg:h-post">
        <div>
          <div className="w-full h-96">
            <NavLink to={`/post/${firstPost.id}`}>
              <img
                src={firstPost.img}
                alt={firstPost.title}
                className="w-full h-full object-cover"
              />
            </NavLink>
          </div>
          <p className="text-black font-semibold text-md mt-3 hover:text-red-600 text-clamp-2">
            <NavLink to={`/post/${firstPost.id}`}>{firstPost.title}</NavLink>
          </p>
          <p className="text-slate-700 font-normal text-sm mt-1 text-clamp-3">
            {firstPost.content}
          </p>
        </div>
        <div className="h-full lg:overflow-hidden">
          {otherPosts.map((post) => (
            <div
              key={post.id}
              className="flex lg:h-1/4 pb-2 border-b-2 mb-2 last:border-0 h-36"
            >
              <div className="w-44 flex-shrink-0">
                <NavLink to={`/post/${post.id}`}>
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </NavLink>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-black font-semibold text-md hover:text-red-600 text-clamp-2">
                  <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
                </p>
                <p className="text-slate-700 font-normal text-sm mt-1 text-clamp-3">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
