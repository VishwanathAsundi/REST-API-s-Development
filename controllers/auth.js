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

  User.findOne({ email: email })
    .then(emailExist => {
      console.log(emailExist, "emailExist");
      if (emailExist) {
        const err = new Error("Email already exists");
        err.statusCode = 422;
        err.data = errors.array();
        throw err;
      }
    })
    .catch(e => {
      if (!e.statusCode) {
        e.statusCode = 422;
      }
      next(e);
    });

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

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error("User is not authorized");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        status: user.status
      });
    })
    .catch(e => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};

exports.updateStatus = (req, res, next) => {
  const status = req.body.status;
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      user.status = status;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: "Status updated successfully" });
    })
    .catch(e => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};
