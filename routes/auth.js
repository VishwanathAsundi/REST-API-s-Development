const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();
const authController = require("../controllers/auth");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(emailExist => {
          if (emailExist) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 }),
    body("name")
      .trim()
      .isLength({ min: 5 })
  ],
  authController.signUp
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Incorrect Password")
  ],
  authController.login
);

module.exports = router;
