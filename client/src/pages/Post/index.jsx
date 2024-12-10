import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { getAllBlogAPI, getTags, getTopViewBlogAPI } from '~/APIs';
import MainLoading from '~/components/common/Loading/MainLoading';
import { formatDateToDDMMYYYY, resolveUrl } from '~/utils/formatters';

const PostPage = () => {
  const [limit, setLimit] = useState(12);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // Modal State
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(''); // Input trong modal

  // Đọc các giá trị từ URL params
  const sort = searchParams.get('sort') || 'newest';
  const tags = searchParams.get('tags') || '';
  const search = searchParams.get('search') || '';

  // Mở modal tìm kiếm
  const openSearchModal = () => {
    setSearchInput(search); // Gán giá trị hiện tại vào input
    setIsSearchModalOpen(true);
  };

  // Đóng modal tìm kiếm
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Xử lý nút Tìm kiếm
  const handleSearchSubmit = () => {
    if (!searchInput.trim()) return; // Prevent empty search
    const params = new URLSearchParams();
    params.set('search', searchInput.trim());
    setSearchParams(params);
    closeSearchModal();
  };

  // Thêm xử lý phím Enter và Esc
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      closeSearchModal();
    }
  };

  // Gọi API lấy bài viết
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['getAllBlogs', limit, sort, tags, search],
    queryFn: () =>
      getAllBlogAPI({
        limit,
        sort,
        tags,
        search,
      }),
  });

  // Gọi API lấy tags
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ['getAllTags'],
    queryFn: getTags,
  });

  // Gọi API lấy bài viết xem nhiều nhất
  const { data: topViewPosts, isLoading: isTopViewPostsLoading } = useQuery({
    queryKey: ['getTopViewBlog'],
    queryFn: getTopViewBlogAPI,
  });

  if (!topViewPosts || !posts || !tagsData) return null;

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 12);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.set('sort', selectedSort);
      return params;
    });
  };

  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    params.set('tags', tag); // Chỉ giữ param 'tags'
    setSearchParams(params); // Cập nhật URL params
  };

  // Thêm hàm xử lý xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.delete('search');
      return params;
    });
  };

  if (isPostsLoading || isTagsLoading || isTopViewPostsLoading) {
    return <MainLoading />;
  }

  return (
    <div className="max-w-container mx-auto">
      <div className="flex flex-wrap -mx-4">
        {/* Danh sách bài viết */}
        <div className="w-full lg:w-9/12 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-8 text-gray-900 uppercase">
              Tin hot nhất
            </h2>
            <div className="flex gap-3 items-center">
              <select
                className="select select-primary w-52"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="mostViews">Xem nhiều nhất</option>
              </select>
              {search && ( // Hiển thị nút xóa tìm kiếm nếu có search param
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                >
                  <Icon icon="line-md:close-small" width={20} height={20} />
                  <span className="text-sm">Xóa tìm kiếm</span>
                </button>
              )}
              <Icon
                className="cursor-pointer"
                icon="line-md:search"
                width={24}
                height={24}
                onClick={openSearchModal} // Mở modal khi bấm vào icon search
              />
            </div>
          </div>
          <div className="hotNewsSwiper grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts?.map((post) => (
              <div
                key={post?._id}
                className="bg-white p-4 rounded shadow border"
              >
                <NavLink to={`/tin-tuc/${post?.slug}`}>
                  <img
                    src={resolveUrl(post?.thumbnail)}
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
                  <p
                    className="h-18 line-clamp-3 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: post?.shortDesc }}
                  />
                  <div className="text-sm text-gray-500 mt-4">
                    <p>Ngày đăng: {formatDateToDDMMYYYY(post?.createdAt)}</p>
                    <p>Người đăng: {post?.authName}</p>
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

        {/* Sidebar */}
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
              <p
                className="text-gray-600 mb-2 text-clamp-3"
                dangerouslySetInnerHTML={{ __html: post?.shortDesc }}
              />
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
            {tagsData?.map((tag) => (
              <div
                key={tag.tag}
                onClick={() => handleTagClick(tag.tag)}
                className="badge badge-secondary px-3 py-1 cursor-pointer"
              >
                {tag.tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Search Fullscreen */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-8 rounded-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={closeSearchModal}
            >
              <Icon icon="line-md:close" width={24} height={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Tìm kiếm bài viết</h2>
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full border p-3 rounded-md"
            />
            <button
              onClick={handleSearchSubmit}
              disabled={!searchInput.trim()}
              className="btn bg-blue-600 text-white mt-4 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
