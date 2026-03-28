const jwt = require('jsonwebtoken');
const response = require('../utils/response');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return response.unauthorized(res, 'Identity verification failed. No token provided.');
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return response.unauthorized(res, 'Security handshake failed. Invalid or expired session.');
    }

    req.user = verified;
    next();
  } catch (err) {
    console.error('Auth Middleware Exception:', err.message);
    response.unauthorized(res, 'Session synchronisation failure. Please log in again.');
  }
};

module.exports = auth;
