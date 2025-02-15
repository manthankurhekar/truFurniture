const express = require("express");
const manufacturerRoute = require('./manufacturer.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: "/manufacturer",
    route: productRoute,
  }, 
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
