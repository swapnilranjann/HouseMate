/**
 * Standard API Response Utility
 */

const sendResponse = (res, statusCode, success, data = null, message = '', errors = null) => {
    return res.status(statusCode).json({
      success,
      data,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  };
  
  const success = (res, data, message = 'Operation successful', statusCode = 200) => {
    return sendResponse(res, statusCode, true, data, message);
  };
  
  const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return sendResponse(res, statusCode, false, null, message, errors);
  };
  
  const unauthorized = (res, message = 'Access denied. Please authenticate.') => {
    return sendResponse(res, 401, false, null, message);
  };
  
  module.exports = {
    success,
    error,
    unauthorized
  };
