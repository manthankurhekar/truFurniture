const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, 
      minLength: 1
    },
    otp: {
      type: Number, 
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
 
otpSchema.plugin(toJSON);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;