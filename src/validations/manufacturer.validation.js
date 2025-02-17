const Joi = require('joi');

const registerAsManufacturer = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1), 
    email: Joi.string().required().email(),
    organizationName: Joi.string().required().min(1), 
    phoneNumber: Joi.string().required().min(1)
  }),
};

module.exports = { registerAsManufacturer };