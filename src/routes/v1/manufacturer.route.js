const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const router = express.Router();
const manufacturerService = require('../../services/manufacturer.service');
const authService = require('../../services/auth.service');
const tokenService = require('../../services/token.service');
const ApiError = require("../../utils/ApiError");
const logger = require('../../config/logger');
const httpStatus = require('http-status');
const config = require('../../config/config');
const moment = require('moment');

router.post(
  "/register",
  validate(authValidation.registerAsManufacturer), async (req, res) => {
    try {
        await manufacturerService.createManufacturer(req.body);
        res.status(httpStatus.status.CREATED).json({
            message: "Manufacturer registered successfully"
        });
    } catch(err) {
        logger.error(err.message);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, err.message);
    }
  }
);

router.post("/login", validate(authValidation.login), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUserWithEmailAndPassword(email, password);
        const expires = moment().add(1, 'days').set({ hour: config.jwt.accessExpirationHour, minute: 0, second: 0, millisecond: 0 });
        const token = await tokenService.generateToken(user.id, expires, config.jwt.secret);
        res.send({ user, token });
    } catch(err) {
        logger.error(err.message);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, err.message);
    }
    
});

module.exports = router;
