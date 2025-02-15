const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const toJSON = require("./plugins/toJSON.plugin");
const logger = require("../config/logger");

const validateEmail = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Email is invalid");
    throw new Error("Email is invalid");
  }
};

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      message: "Name cannot be empty",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 1,
      message: "Email cannot be empty",
      validate: [
        {
          validator: validateEmail,
          message: "Email is invalid",
        },
      ],
    },

    password: {
      type: String,// removed password requirred cause we are sending it from server side
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value || value.length === 0) { // Check if empty
          throw new Error("Password cannot be empty");
        }
        if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) { // Check for letters and numbers
          logger.error("Password must contain at least one letter and one number");
          throw new Error("Password must contain at least one letter and one number");
        }
      },
      private: true, // used by the toJSON plugin
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      // the regex check is for indian phone numbers
      validate: [
        {
          validator: (value) => {
            const phoneRegex = /^[0-9]{10}$/;
            return phoneRegex.test(value);
          },
          message: "Phone number is invalid",
        },
      ],
    },
    role: {
      type: String,
      enum: ["manufacturer", "retailer"],
      // default is empty for now because we will register the role as per the
      // registration page
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      console.log("Password before hashing:", user.password); // Debugging
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      console.log("Password after hashing:", user.password); // Debugging
    }
    next();
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
