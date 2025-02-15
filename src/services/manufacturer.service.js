const User = require("../models/user.model");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const Organization = require("../models/organization.model");
const crypto = require("crypto");
const Admin = require("../models/admin.model");
const { sendMail } = require("../services/email.service");
const disposableEmail = require('disposable-email');
// manufacturer body contains
// organizationName, email, phoneNumber, name

const createManufacturer = async (manufacturerBody) => {
  const { organizationName, email, phoneNumber, name } = manufacturerBody;
  if (await User.isEmailTaken(email)) {
    logger.error("Email already taken");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email already taken");
  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (!validateEmail(email) && !disposableEmail.validate(email)) {
    logger.error("Email is invalid");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email is invalid");
  }
  if (await User.isPhoneNumberTaken(phoneNumber)) {
    logger.error("Phone number already taken");
    throw new ApiError(
      httpStatus.status.BAD_REQUEST,
      "Phone number already taken"
    );
  }

  // i have hard coded it here for now
  const response = { body: { verdict: true } };

  if (response.body.verdict === true) {
    const organization = await Organization.create({
      name: organizationName,
      orgType: "manufacturer",
    });

    const newPassword = crypto.randomBytes(4).toString("hex");
    const user = await User.create({
      name,
      email,
      password: newPassword,
      phoneNumber,
      role: "manufacturer",
    });

    const admin = await Admin.create({
      userId: user.id,
      orgId: organization.id,
    });

    const emailResponse = await sendMail(
      "manthankurhekar8@gmail.com",
      email,
      "Welcome to our website",
      "text",
      `<h1>This is your email: ${email}</h1><h1>This is your password: ${newPassword}</h1>`
    );
    logger.info(JSON.stringify(emailResponse, null, 2));
  }
};

module.exports = {
  createManufacturer,
};
