const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    minLength: 1,
  },
  logo: {
    type: String,
    trim: true,
    required: false,
    minLength: 1,
  },
  socialMediaHandles: {
    type: [String],
    required: false,
    minLength: 1,
  },
  orgType: {
    type: String,
    required: false,
    enum: ["manufacturer", "retailer"],
  },
});

organizationSchema.statics.isNameTaken = async function (name, excludeOrgId) {
  const org = await this.findOne({ name, id: { $ne: excludeOrgId } });
  return !!org;
};

organizationSchema.plugin(toJSON);

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
