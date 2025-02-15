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
      minLength: 1,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 1,
      validate: [
        {
          validator: validateEmail,
          message: "Email is invalid",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          logger.error(
            "Password must contain at least one letter and one number"
          );
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
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
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, id: { $ne: excludeUserId } });
  return !!user;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
