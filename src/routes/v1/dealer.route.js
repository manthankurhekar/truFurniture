const express = require("express");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const dealerService = require("../../services/dealer.service");
const { authorizeJwt, authorizeRoles } = require("../../middlewares/auth");
const router = express.Router();
const {} = require('../../middlewares/auth');

// Add Dealer
router.post(
  "/",
  authorizeJwt(),
  authorizeRoles(["addDealers"]),
  catchAsync(async (req, res) => {
    //verify email
    const dealer = await dealerService.addDealer(req.body);
    res
      .status(httpStatus.status.CREATED)
      .json({ message: "Dealer added successfully!", dealer });
  })
);

// Get Dealers
router.get(
  "/",
  authorizeJwt(),
  authorizeRoles(["getDealers"]),
  catchAsync(async (req, res) => {
    const dealers = await dealerService.getDealers();
    res.status(httpStatus.status.OK).json(dealers);
  })
);

module.exports = router;
