export default function CategoryContent({ slug }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{slug} w0wStore</h2>
      <div className="mb-8">
        {/* Sorting Form */}
        <form className="flex space-x-4 items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sắp xếp theo:
          </label>
          <select className="select select-bordered w-full max-w-xs select-sm">
            <option selected>Mặc định</option>
            <option>Mới nhất</option>
            <option>Phổ biến</option>
            <option>Tên (từ A - Z )</option>
            <option>Tên (từ Z - A )</option>
            <option>Giá (từ cao - thấp )</option>
            <option>Giá (từ thấp - cao )</option>
          </select>
        </form>
      </div>

      {/* Content */}
      <div>{/* Add your content here */}</div>
    </div>
  );
}
