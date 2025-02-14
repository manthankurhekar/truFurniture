const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const orgSchema = mongoose.Schema(
    {
        name: {
            type: String, 
        }, 
        logo: {
            type: String, 
        }, 
        socialMediaHandles : {
            type: [String], 
        }, 
        orgType: {
            type: String, 
            required: false,
            enum: ['manufacturer', 'retailer']
        }
    }
);

orgSchema.plugin(toJSON);

const Organization = mongoose.model("Organization", orgSchema);

module.exports = Organization;