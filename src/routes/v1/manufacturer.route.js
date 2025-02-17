const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const manufacturerValidation = require("../../validations/manufacturer.validation");
const router = express.Router();
const manufacturerService = require("../../services/manufacturer.service");
const authService = require("../../services/auth.service");
const tokenService = require("../../services/token.service");
const ApiError = require("../../utils/ApiError");
const logger = require("../../config/logger");
const httpStatus = require("http-status");
const config = require("../../config/config");
const moment = require("moment");
const catchAsync = require("../../utils/catchAsync");
const { authorizeJwt, authorizeRoles } = require("../../middlewares/auth");

router.post(
  "/register",
  validate(manufacturerValidation.registerAsManufacturer),
  catchAsync(async (req, res) => {
    const manufacturer = await manufacturerService.createManufacturer(req.body);
    res.status(httpStatus.status.CREATED).json({
      message: "Manufacturer registered successfully",
      manufacturer,
    });
  })
);

router.post(
  "/login",
  validate(authValidation.login),
  catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );
    const expires = moment().add(1, "days").set({
      hour: config.jwt.accessExpirationHour,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const token = await tokenService.generateToken(
      user.id,
      expires,
      config.jwt.secret
    );
    res.send({ user, token });
  })
);

module.exports = router;
