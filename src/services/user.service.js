const httpStatus = require("http-status");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    logger.error("Email already taken");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email already taken");
  }
  logger.info("User created successfully");
  const user = await User.create(userBody);
  return user;
};

const getUsers = async () => {
  logger.info("Successfully returned list of all users");
  return await User.find();
};

const getUserByEmail = async (email) => {
  logger.info("Successfully returned user by email");
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  logger.info("Successfully returned user by Id");
  return await User.findById(id);
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
};
