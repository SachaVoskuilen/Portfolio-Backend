let special = require("@controllers/specialController");
let user = require("@controllers/userController");

import { Router } from "express";

let router = Router();

// Special routes
router.route("/").get(special.default);

// User routes
router.route("/login").get(user.login);
router.route("/register").get(user.register);

// Export all api routes
module.exports = router;
