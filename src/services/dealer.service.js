const httpStatus = require("http-status");
const Dealer = require("../models/dealer.model");
const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailService = require("./email.service");

// Get user by email
const getUserByEmail = async (email) => {
  logger.info("Successfully returned user by email");
  return await User.findOne({ email });
};

// Add a new dealer
const addDealer = async (dealerBody) => {
  const { name, email, phoneNumber, address, zipCode, city } = dealerBody;

  // ✅ Check if OTP is verified before creating user
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord || !otpRecord.isVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email not verified. Verify OTP first.");
  }

  // ✅ Generate & hash password
  const password = crypto.randomBytes(6).toString("hex");
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt);

  // ✅ Create User
  const user = await User.create({ name, email, phoneNumber, password: hashedPassword });

  // ✅ Create Dealer
  const dealer = await Dealer.create({ user: user._id, address, zipCode, city });

  // ✅ Send email with credentials
    const emailHtml = `<p>Hello ${name},</p>
    <p>Your account has been created successfully. Here are your credentials:</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Password:</strong> ${password}</p>
    <p>Please log in and change your password for security reasons.</p>`;

    await emailService.sendEmail(email, "Your Dealer Account Credentials", emailHtml);


  // ✅ Delete OTP after successful dealer creation
  await OTP.deleteOne({ email });

  return dealer;
};

// Get all dealers
const getDealers = async () => {
  return await Dealer.find().populate("user", "name email");
};

module.exports = {
  getUserByEmail,
  addDealer,
  getDealers,
};
