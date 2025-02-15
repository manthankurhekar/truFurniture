const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Ensures only one OTP per email at a time
    },
    otp: {
      type: Number, // Store OTP as a number instead of a string
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "5m" }, // Auto-delete expired OTPs
    },
    isVerified: {
        type: Boolean,
        default: false, // Set to true when OTP is successfully verified
    }
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
