const AddressList = () => {
  return (
    <div className="text-black bg-white rounded-sm p-10">
      <h1 className="text-xl font-bold pb-3">ĐỊA CHỈ GIAO HÀNG</h1>
      <div>
        <div className="mt-4 rounded-sm border-b py-4 w-full flex justify-between">
          <div>
            <p>Phan Thanh Hoá</p>
            <p>45 / 19 Nguyễn Viết Xuân, Tân Thành, Buôn Ma Thuột, Dak lak</p>
          </div>
          <div>
            <p>Chỉnh sửa</p>
            <p>Xoá</p>
          </div>
        </div>
      </div>
    </div>
  );
};

AddressList.propTypes = {};

export default AddressList;
