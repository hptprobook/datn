import { NavLink } from 'react-router-dom';

const PostPage = () => {
  const posts = [
    {
      id: 1,
      title: 'Tiêu đề bài viết 1',
      description: 'Mô tả ngắn gọn về bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-1.jpg',
      tags: ['Tag1', 'Tag2'],
      date: '2024-07-18',
      author: 'Tác giả 1',
      views: 100,
    },
    {
      id: 1,
      title: 'Tiêu đề bài viết 1',
      description: 'Mô tả ngắn gọn về bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-2.jpg',
      tags: ['Tag1', 'Tag2'],
      date: '2024-07-18',
      author: 'Tác giả 1',
      views: 100,
    },
    {
      id: 1,
      title:
        'Tiêu đề bài viết  asdasda sd asdas dasdasdasdasdas dá dá dá1 Tiêu đề bài viết  asdasda sd asdas dasdasdasdasdas dá dá dá1',
      description:
        'Mô tả ngắn gọn về bài viết 1.. đá ádasd. Mô tả ngắn gọn về bài viết 1.. đá ádasd. Mô tả ngắn gọn về bài viết 1.. đá ádasd. Mô tả ngắn gọn về bài viết 1.. đá ádasd.Mô tả ngắn gọn về bài viết 1.. đá ádasd.',
      image: 'https://swiperjs.com/demos/images/nature-3.jpg',
      tags: ['Tag1', 'Tag2'],
      date: '2024-07-18',
      author: 'Tác giả 1',
      views: 100,
    },
  ];

  const suggestedPosts = [
    {
      id: 1,
      title: 'Đề xuất bài viết 1',
      description: 'Mô tả ngắn gọn về đề xuất bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-2.jpg',
    },
    {
      id: 1,
      title: 'Đề xuất bài viết 1',
      description: 'Mô tả ngắn gọn về đề xuất bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-2.jpg',
    },
    {
      id: 1,
      title: 'Đề xuất bài viết 1',
      description: 'Mô tả ngắn gọn về đề xuất bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-2.jpg',
    },
    {
      id: 1,
      title: 'Đề xuất bài viết 1',
      description: 'Mô tả ngắn gọn về đề xuất bài viết 1...',
      image: 'https://swiperjs.com/demos/images/nature-2.jpg',
    },
  ];

  return (
    <div className="max-w-container mx-auto p-4">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-9/12 px-4">
          <h2 className="text-xl font-bold mb-8">Tin hot nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow border">
                <NavLink to={`/tin-tuc/${post.title}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </NavLink>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="mr-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <NavLink to={`/tin-tuc/${post.title}`}>
                    <h2 className="text-xl font-bold mt-2 text-clamp-2 h-18 hover:text-red-600">
                      {post.title}
                    </h2>
                  </NavLink>
                  <p className="h-18 text-clamp-3">{post.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Ngày đăng: {post.date}</p>
                    <p>Người đăng: {post.author}</p>
                    <p>Số lượt xem: {post.views}</p>
                  </div>
                  <button className="mt-2 text-blue-500 hover:text-red-600">
                    Xem ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center my-12">
            <button className="btn btn-error rounded-md ">Xem thêm</button>
          </div>
        </div>

        <div className="w-full lg:w-3/12 px-4 mt-4 lg:mt-0">
          <h2 className="text-xl font-bold mb-8">Đáng xem</h2>
          {suggestedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow mb-4 border"
            >
              <NavLink to={`/tin-tuc/${post.title}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-24 mb-3 object-cover rounded"
                />
              </NavLink>
              <NavLink to={`/tin-tuc/${post.title}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-red-600">
                  {post.title}
                </h2>
              </NavLink>
              <p>{post.description}</p>
              <button className="mt-2 text-blue-500 hover:text-red-600">
                Xem ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PostPage.propTypes = {};

export default PostPage;
