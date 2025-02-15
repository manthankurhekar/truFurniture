const Joi = require('joi');
const { password } = require('./custom.validation');

const registerAsManufacturer = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1), 
    email: Joi.string().required().email(),
    organizationName: Joi.string().required().min(1), 
    phoneNumber: Joi.string().required().min(1)
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(), 
    password: Joi.string().required(),
  }),
};

// const logout = {
//   body: Joi.object().keys({
//     refreshToken: Joi.string().required(),
//   }),
// };

module.exports = {
  register,
  login,
  // logout
};
