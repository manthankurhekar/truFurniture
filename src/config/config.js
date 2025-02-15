const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// in this file the meaning of expiration hour is basically the hour at which jwt will expire every day 
// for example in our case at 2:00 am 
// if we want to expire it at 2:00 pm then we have to write 14, because we are considering 24 hour format

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT access secret key'),
    JWT_ACCESS_EXPIRATION_HOUR: Joi.number().default(2).description('daily hour at which jwt token will expire automatically'),  
    SMTP_HOST: Joi.string().required().description('smtp host address'),
    SMTP_PORT: Joi.number().required().description('smtp port'), 
    SMTP_USER: Joi.string().required().description('smtp user'), 
    SMTP_USER_PASS: Joi.string().required().description('smtp user password')
  }) 
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationHour: envVars.JWT_ACCESS_EXPIRATION_HOUR
  }, 
  smtp: {
    host: envVars.SMTP_HOST, 
    port: envVars.SMTP_PORT, 
    user: envVars.SMTP_USER, 
    userPass: envVars.SMTP_USER_PASS
  }
};
