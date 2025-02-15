const User = require("../models/user.model");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const Organization = require("../models/organization.model");
const crypto = require("crypto");
const Admin = require("../models/admin.model");
const { sendMail } = require("../services/email.service");
const { join } = require("path");

// manufacturer body contains
// organizationName, email, phoneNumber, name

const createManufacturer = async (manufacturerBody) => {
  const { organizationName, email, phoneNumber, name } = manufacturerBody;
  if (await User.isEmailTaken(email)) {
    logger.error("Email already taken");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email already taken");
  }
  if (await User.isPhoneNumberTaken(phoneNumber)) {
    logger.error("Phone number already taken");
    throw new ApiError(
      httpStatus.status.BAD_REQUEST,
      "Phone number already taken"
    );
  }
  if (await Organization.isNameTaken(organizationName)) {
    logger.error("Name already taken");
    throw new ApiError(
      httpStatus.status.BAD_REQUEST,
      "Organization name already taken"
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
      newPassword,
      phoneNumber,
      role: "manufacturer",
    });

    const admin = await Admin.create({
      userId: user._id,
      orgId: organization._id,
    });

    const emailResponse = await sendMail(
      "truBusiness",
      email,
      "Welcome to our website",
      "text",
      `<h1>This is your email: ${email}</h1><h1>This is your password: ${newPassword}</h1>`
    );

    logger.info(emailResponse);
  }
};
