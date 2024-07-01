import { jwtDecode } from 'jwt-decode';

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'Missing token' });
  }
  try {
    req.user = jwtDecode(token);
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthenticated' });
  }
};

export default verifyToken;
