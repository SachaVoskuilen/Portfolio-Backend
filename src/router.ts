var special = require("@controllers/specialController");
var user = require("@controllers/userController");

import { Router } from "express";

var router = Router();

// Special routes
router.route("/").get(special.default);

// User routes
router.route("/login").get(user.login);
router.route("/register").get(user.register);

// Export all api routes
module.exports = router;
