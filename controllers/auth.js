const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwtoken = require("jsonwebtoken");

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const err = new Error("User with that email doesn't exist");
        err.statusCode = 401;
        err.data = errors.array();
        throw err;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const err = new Error("Incorrect password");
        err.statusCode = 401;
        err.data = errors.array();
        throw err;
      }

      const token = jwtoken.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        "secretkey",
        { expiresIn: "1hr" }
      );
      res.status(200).json({
        message: "Signed in Successfully",
        token: token,
        userId: loadedUser._id.toString()
      });
    })
    .catch(e => {
      if (!e.statusCode) {
        e.statusCode = 401;
      }
      next(e);
    });
};

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then(hashedPwd => {
      let user = new User({
        email: email,
        password: hashedPwd,
        name: name,
        status: "A new"
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch(e => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};
