import { Icon } from '@iconify/react';
import { useState } from 'react';

const fakeComments = [
  {
    id: 1,
    product: 'Áo khoác mùa đông',
    image: 'https://via.placeholder.com/150',
    price: 1000000,
    date: '2024-10-14 10:30',
    content: 'Áo rất đẹp và ấm, chất lượng tốt!',
    productLink: '/product/1',
    commentLink: '/product/1#comment-1',
    replies: [
      {
        id: 1,
        user: 'Shop',
        content: 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!',
        fromShop: true,
      },
      {
        id: 2,
        user: 'Nguyễn Văn B',
        content: 'Áo này có giặt máy được không?',
        fromShop: false,
      },
    ],
  },
  {
    id: 2,
    product: 'Giày thể thao nam',
    image: 'https://via.placeholder.com/150',
    price: 1000000,
    date: '2024-10-12 15:45',
    content: 'Giày đi rất êm chân, rất hài lòng!',
    productLink: '/product/2',
    commentLink: '/product/2#comment-2',
    replies: [
      {
        id: 3,
        user: 'Shop',
        content: 'Cảm ơn bạn, chúc bạn luôn vui vẻ!',
        fromShop: true,
      },
    ],
  },
];

const Comment = ({ comment }) => {
  const [isRepliesVisible, setRepliesVisible] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {/* Link to product */}
      <a href={comment.productLink} className="flex items-center mb-2">
        <img
          src={comment.image}
          alt={comment.product}
          className="w-16 h-16 mr-4 rounded-md"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg text-blue-500 hover:underline">
            {comment.product}
          </h2>
          <p className="text-gray-500 text-sm">{comment.price}</p>
        </div>
      </a>
      <p className="text-gray-500 text-sm">{comment.date}</p>
      <div className="flex items-center gap-2 my-3">
        <Icon icon="fa6-solid:star" className="text-yellow-500" />
        <Icon icon="fa6-solid:star" className="text-yellow-500" />
        <Icon icon="fa6-solid:star" className="text-yellow-500" />
        <Icon icon="fa6-solid:star" className="text-yellow-500" />
        <Icon icon="fa6-solid:star" className="text-yellow-500" />
      </div>
      <p className="mt-2">{comment.content}</p>

      {/* Toggle button for replies */}
      {comment.replies.length > 0 && (
        <button
          onClick={() => setRepliesVisible(!isRepliesVisible)}
          className="text-blue-500 mt-2"
        >
          {isRepliesVisible
            ? 'Ẩn trả lời'
            : `Xem ${comment.replies.length} trả lời`}
        </button>
      )}

      {/* Replies section */}
      {isRepliesVisible && (
        <div className="mt-3 ml-4">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-2 rounded-md mb-2 ${
                reply.fromShop ? 'bg-yellow-100 font-semibold' : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">
                <span className="font-bold">{reply.user}</span>: {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MyRated = () => {
  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">
        Đánh giá của tôi ({fakeComments.length})
      </h1>

      {/* Comments list */}
      {fakeComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default MyRated;
