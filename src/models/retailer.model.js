const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const retailerSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    message: "Address cannot be empty",
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    message: "Zip code cannot be empty",
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    message: "City cannot be empty",
  },
});

retailerSchema.plugin(toJSON);

const Retailer = mongoose.model("Retailer", retailerSchema);

module.exports = Retailer;