const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const dealerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: 1,
    },
    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      trim: true,
      minlength: 1,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: 1,
    },
  },
  { timestamps: true }
);

dealerSchema.plugin(toJSON);

const Dealer = mongoose.model("Dealer", dealerSchema);

module.exports = Dealer;