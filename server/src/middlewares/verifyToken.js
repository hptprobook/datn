// import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
const verifyToken = async(req, res, next) => {
    const data = req.headers.authorization;
    if (!data) {
        return res.status(401).send({ message: 'Bạn không có quyền truy cập' });
    }
    // const token = req.headers.authorization.split(' ')[1];
    try {
        // const decodedToken = jwtDecode(token);
        // Kiểm tra thời hạn token nếu cần thiết
        // const isExpired = decodedToken.exp < Date.now() / 1000;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res
                .status(401)
                .send({ message: 'Phiên đăng nhập đã hết hạn' });
        }
        return res.status(401).send({ message: 'Lỗi bảo mật' });
    }
};

export default verifyToken;