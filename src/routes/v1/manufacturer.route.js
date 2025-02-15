const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.registerAsManufacturer),
  authController.register
);

module.exports = router;
