const nodemailer = require("nodemailer");
const logger = require("../config/logger");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.brevoEmail,
      pass: config.email.brevoPassword,
    },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML format)
 */
const sendEmail = async (to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: 'sumitnagrikar1@gmail.com',
      to,
      subject,
      html,
    });
    logger.info(`Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 */
const sendOTPEmail = async (email, otp) => {
  const subject = "Your OTP for Dealer Verification";
  const html = `<p>Your OTP for verifying your email is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`;
  return sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
};
