const jwt = require('jsonwebtoken'); // Ensure you have the 'jsonwebtoken' package installed

export const createToken = (user, expiresIn = 6 * 60 * 60) => {
    // Default to 6 hours
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
};

export const createRefreshToken = (user, expiresIn = 15 * 60 * 60) => {
    const dataToken = {
        user_id: user._id,
        email: user.email,
        role: user.role,
    };
    const refresh_secret = process.env.REFRESH_SECRET;
    if (!refresh_secret) {
        throw new Error('Missing JWT refresh secret in environment variables');
    }
    return jwt.sign(dataToken, refresh_secret, { expiresIn });
};
export const createStaffToken = (user, type = 'token') => {
    const expiresIn = type === 'token' ? 6 * 60 * 60 : 30 * 24 * 60 * 60;
    const dataToken = {
        user_id: user._id,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
    };
    const secret = process.env.SECRET_STAFF;
    if (!secret) {
        throw new Error('Missing JWT secret in environment variables');
    }
    return jwt.sign(dataToken, secret, { expiresIn });
};