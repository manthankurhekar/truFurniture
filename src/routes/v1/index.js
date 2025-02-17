const express = require("express");
const manufacturerRoute = require('./manufacturer.route');
const dealerRoutes = require('./dealer.route');
const otpRoutes = require('./otp.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: "/manufacturer",
    route: manufacturerRoute,
  }, 
  {
    path: "/dealers", 
    route: dealerRoutes
  }, 
  {
    path: "/otp", 
    route: otpRoutes
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
