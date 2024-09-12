
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