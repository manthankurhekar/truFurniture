const config = require("../config/config");
const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");
const httpStatus = require('http-status');
const logger = require('../config/logger');
const sendMail = async (fromEmail, toEmail, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.userPass,
      },
    });
    let info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    logger.error("Error in transporter");
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      "Error in mail service"
    );
  }
};

const sendOTPEmail = async (toEmail, otp) => {
  const subject = "Your OTP for Dealer Verification";
  const html = `<p>Your OTP for verifying your email is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`;
  return sendMail('manthankurhekar8@gmail.com', toEmail, subject, 'Hello there mate...', html);
};

module.exports = { sendMail, sendOTPEmail };
