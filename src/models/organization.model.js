const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");

const orgSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: false, 
            trim: true, 
            validate: {
                validator: (value) => {
                    return value.trim().length > 0;
                },
                message: "Name cannot be empty"
            }
        }, 
        logo: {
            type: String, 
            trim: true, 
            required: false, 
            validate: {
                validator: (value) => {
                    return value.trim().length > 0;
                },
                message: "Logo cannot be empty"
            }
        }, 
        socialMediaHandles : {
            type: [String], 
            required: false, 
            validate: {
                validator: (value) => {
                    return value.length > 0;
                },
                message: "Social Media Handles cannot be empty"
            }
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