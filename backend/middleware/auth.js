const jwt = require('jsonwebtoken');
const User = require('../models/User');
const response = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return response.unauthorized(res, 'Authentication required. No session token detected.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user still exists in database
      const user = await User.findById(decoded.id);
      if (!user) {
        return response.unauthorized(res, 'Security breach. Account no longer exists.');
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return response.unauthorized(res, 'Session expired. Please re-authenticate your identity.');
      }
      return response.unauthorized(res, 'Invalid security token identification failed.');
    }
  } catch (err) {
    console.error('CRITICAL_AUTH_FAILURE:', err.stack);
    response.error(res, 'Infrastructure error during authentication handshake.');
  }
};

module.exports = auth;
