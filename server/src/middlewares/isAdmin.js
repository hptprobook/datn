import { userModel } from '~/models/userModel';
const isAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const user = await userModel.getUserID(user_id);
    if (user.role == 'root') {
      next();
    } else {
      return res.status(403).send({ message: 'Bạn không đủ thẩm quyền' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

export default isAdmin;
