const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  console.log('heyy===>>>', error instanceof ApiError)
  if (!(error instanceof ApiError)) {
    console.log('hello===>>>>')
    const statusCode =
    (error.statusCode || error instanceof mongoose.Error)
    ? httpStatus.status.BAD_REQUEST
    : httpStatus.status.INTERNAL_SERVER_ERROR;
    console.log('statusCode===>>>',statusCode)
    logger.info("Status Code:", statusCode); // Debugging line
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  if(!error.statusCode){
    error.statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.status.INTERNAL_SERVER_ERROR];
  }
  console.log("Final Status Code:", statusCode); // Debugging line

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode)?.send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};