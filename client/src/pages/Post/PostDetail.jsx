import { FaCalendarAlt } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';

const PostDetail = () => {
  const { slug } = useParams();

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
    <div className="max-w-container mx-auto p-4 ">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-9/12 px-4 ">
          <h2 className="text-2xl font-bold mb-4 uppercase">{slug}</h2>
          <div className="text-slate-400 flex items-center font-bold mb-2">
            <FaCalendarAlt />
            <span className="ml-2">01/01/2023</span>
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

PostDetail.propTypes = {};

export default PostDetail;
