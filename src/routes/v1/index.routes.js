const express = require('express');
const dealerRoutes = require("./dealer.routes");
const otpRoutes = require("./otp.routes");

const router = express.Router();

const defaultRoutes = [

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