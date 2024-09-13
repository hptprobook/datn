import { jwtDecode } from 'jwt-decode';

const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Thiếu token' });
    }

    try {
        const decodedToken = jwtDecode(token);

        // Kiểm tra thời hạn token nếu cần thiết
        // const isExpired = decodedToken.exp < Date.now() / 1000;

        // if (isExpired) {
        //   return res.status(401).send({ message: 'Token hết hạn' });
        // }

        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Lỗi bảo mật' });
    }
};

export default verifyToken;