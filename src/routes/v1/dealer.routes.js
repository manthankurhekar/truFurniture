const express = require("express");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const dealerService = require("../../services/dealer.service");

const router = express.Router();

// Add Dealer
router.post(
  "/",
  catchAsync(async (req, res) => {
    //verify email

    const dealer = await dealerService.addDealer(req.body);
    res.status(httpStatus.status.CREATED).json({ message: "Dealer added successfully!", dealer });
  })
);

// Get Dealers
router.get(
  "/",
  catchAsync(async (req, res) => {
    const dealers = await dealerService.getDealers();
    res.status(httpStatus.status.OK).json(dealers);
  })
);

module.exports = router;
