const OTP = require("../models/otp.model");
const crypto = require("crypto");
const emailService = require("./email.service");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Dealer = require("../models/dealer.model");

// Generate & Send OTP
const generateAndSendOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expire in 5 mins

  // Remove any existing OTP for this email
  await OTP.deleteOne({ email });
  await OTP.create({ email, otp, expiresAt });

  // Send OTP email
  await emailService.sendOTPEmail(email, otp);

  logger.info(`OTP sent successfully to ${email}`);
  return { message: "OTP sent successfully!" };
};

// Verify OTP & Return Success
const verifyOTP = async (email, enteredOtp) => {
    const otpRecord = await OTP.findOne({ email });
  
    if (!otpRecord) throw new ApiError(httpStatus.status.BAD_REQUEST, "OTP not found.");
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      throw new ApiError(httpStatus.status.BAD_REQUEST, "OTP expired.");
    }
    if (otpRecord.otp !== Number(enteredOtp)) {
      throw new ApiError(httpStatus.status.BAD_REQUEST, "Invalid OTP.");
    }
  
    // Mark OTP as verified
    await OTP.updateOne({ email }, { isVerified: true });
  
    return { message: "OTP verified successfully!" };
  };
  

module.exports = { generateAndSendOTP, verifyOTP };