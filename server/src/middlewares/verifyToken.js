// import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
const verifyToken = async (req, res, next) => {
    const data = req.headers.authorization;
    if (!data) {
        return res.status(401).send({ message: 'Bạn không có quyền truy cập' });
    }
    // const token = req.headers.authorization.split(' ')[1];
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Lỗi bảo mật' });
    }
};

export default verifyToken;