const Joi = require('joi');
const { password } = require('./custom.validation');

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
  login,
  // logout
};
