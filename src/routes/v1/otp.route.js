const express = require("express");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const otpService = require("../../services/otp.service");

const router = express.Router();

// Generate OTP
router.post("/generate", catchAsync(async (req, res) => {
  const { email } = req.body;
  const response = await otpService.generateAndSendOTP(email);
  res.status(httpStatus.status.OK).json(response);
}));

// Verify OTP
router.post("/verify", catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const response = await otpService.verifyOTP(email, otp);
  res.status(httpStatus.status.OK).json(response);
}));

module.exports = router;