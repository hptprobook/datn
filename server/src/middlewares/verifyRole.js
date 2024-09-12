
// quyền nhân viên chuyên quản lý sản phẩm, đơn hàng, thống kê, không thể thêm xóa sửa user
export const isStaff = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role == 'staff' || role == 'admin' || role == 'root') {
      next();
    } else {
      return res.status(401).send({ message: 'Bạn không đủ thẩm quyền' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};
// quyền admin tổng có thể dùng được mọi chức năng của dashboard và có thể thêm xóa sửa user, cấp quyền cho user
export const isRoot = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role == 'root') {
      next();
    } else {
      return res.status(401).send({ message: 'Bạn không đủ thẩm quyền' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};
// quyền quản trị viên có thể dùng được mọi chức năng của dashboard và có thể thêm, sửa user, xóa user không phải root
export const isAdmin = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role == 'staff' || role == 'admin' || role == 'root') {
      next();
    } else {
      return res.status(401).send({ message: 'Bạn không đủ thẩm quyền' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};