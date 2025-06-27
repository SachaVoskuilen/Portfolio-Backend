let about = require("@controllers/aboutMeController");
let language = require("@controllers/languageController");
let projects = require("@controllers/projectController");
let utility = require("@controllers/utilityController");
let user = require("@controllers/userController");

import { Router } from "express";

let router = Router();

// Special routes
router.route("/").get(utility.redirectSlice);

// User routes
router.route("/login").post(user.login);
router.route("/register").post(user.register);

// About Me routes
router.route("/about-me").get(about.aboutMe);

// About Me routes
router.route("/projects").get(projects.getProjects);

// About Me routes
router.route("/languages").get(language.getLanguages);

// Export all api routes
module.exports = router;
