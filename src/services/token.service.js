
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const User = require("../models/user.model");

const generateToken = async (userId, expires, secret) => {
    try {
      const user = await User.findById(userId).select("role");
      const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        role: user.role,
      };
      const accessToken = await jwt.sign(payload, secret);
      return {
        access: {
            token: accessToken, 
            expires: expires.toDate()
        }
      }
    } catch (err) {
      logger.error(err, "Token not generated successfully");
      throw new Error("500, Internal Server Error");
    }
  };

  module.exports = { generateToken };
  