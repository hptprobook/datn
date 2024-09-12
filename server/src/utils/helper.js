const jwt = require('jsonwebtoken'); // Ensure you have the 'jsonwebtoken' package installed

export const createToken = (user, expiresIn = 6 * 60 * 60) => { // Default to 6 hours
  const dataToken = {
    user_id: user._id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.SECRET; // Access secret securely from environment variables

  if (!secret) {
    throw new Error('Missing JWT secret in environment variables');
  }

  return jwt.sign(dataToken, secret, { expiresIn });
}

export const refreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const refreshTime = 15 * 60 * 60; // 15 days in seconds
    const newToken = createToken(decoded, refreshTime);
    return newToken;
  } catch (error) {
    return null;
  }
}