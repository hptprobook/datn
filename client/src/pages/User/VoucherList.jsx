const VoucherList = () => {
  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">Mã giảm giá dành cho bạn</h1>
      <div className="container mx-auto">
        <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
          <h3 className="text-2xl font-semibold my-4">
            Giảm giá 20% cho đơn hàng trên 100.000đ
          </h3>
          <div className="flex items-center space-x-2 mb-6">
            <span
              id="cpnCode"
              className="border-dashed border text-white px-4 py-2 rounded-l"
            >
              STEALDEAL20
            </span>
            <span
              id="cpnBtn"
              className="border border-white bg-white text-red-600 px-4 py-2 rounded-r cursor-pointer"
            >
              Copy Code
            </span>
          </div>
          <p className="text-sm mb-2">Ngày hết hạn: 20-3-2024</p>

          <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
          <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
        </div>
        <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
          <h3 className="text-2xl font-semibold my-4">Miễn phí giao hàng</h3>
          <div className="flex items-center space-x-2 mb-6">
            <span
              id="cpnCode"
              className="border-dashed border text-white px-4 py-2 rounded-l"
            >
              FREESHIP
            </span>
            <span
              id="cpnBtn"
              className="border border-white bg-white text-red-600 px-4 py-2 rounded-r cursor-pointer"
            >
              Copy Code
            </span>
          </div>
          <p className="text-sm mb-2">Ngày hết hạn: 20-3-2024</p>

          <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
          <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
        </div>
      </div>
    </div>
  );
};

VoucherList.propTypes = {};

export default VoucherList;
