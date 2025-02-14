const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const tokenService = require('../services/token.service');

// provide email and password and this function will check if the use exists
// if not then it will throw and error
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    logger.error('Incorrect email or password');
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

// currently we don't have any refresh token so logging out simply means deleting the
// access token from the localStorage and navigating the user to the login screen
const logout = async (refreshToken) => {
    
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout
};
