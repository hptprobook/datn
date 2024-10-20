import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const data = req.headers.authorization;
    if (!data) {
        return res.status(401).send({ message: 'Bạn không có quyền truy cập' });
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_STAFF);
        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: 'Phiên đăng nhập hết hạn' });
        }
        return res.status(401).send({ message: 'Lỗi bảo mật' });
    }
};
export const verifyTokenNoTime = async (req, res, next) => {
    const data = req.headers.authorization;
    if (!data) {
        return res.status(401).send({ message: 'Bạn không có quyền truy cập' });
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_STAFF);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Lỗi bảo mật' });
    }
};
const checkRole = (requiredRoles) => (req, res, next) => {
    try {
        const { role } = req.user;
        if (requiredRoles.includes(role)) {
            next();
        } else {
            return res.status(403).send({ message: 'Bạn không đủ thẩm quyền' });
        }
    } catch (error) {
        return res
            .status(401)
            .send({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
};

// Middleware to check for specific roles
export const isStaff = checkRole(['staff', 'admin', 'root']);
export const isAdmin = checkRole(['admin', 'root']);
export const isRoot = checkRole(['root']);
