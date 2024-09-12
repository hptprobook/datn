
const verifyAdmin = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role != 'ban' || role != 'user') {
      next();
    } else {
      return res.status(401).send({ message: 'Bạn không đủ thẩm quyền' });
    }
  } catch (error) {
    return res.status(401).send({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};
export default verifyAdmin;