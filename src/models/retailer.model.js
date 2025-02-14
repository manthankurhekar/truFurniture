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
    required:  true,
    trim: true,
    minLength: 1, 
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
  },
});

retailerSchema.plugin(toJSON);

const Retailer = mongoose.model("Retailer", retailerSchema);

module.exports = Retailer;