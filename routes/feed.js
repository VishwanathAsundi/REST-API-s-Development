const express = require("express");

const feedController = require("../controllers/feed");
const { body } = require("express-validator");

const feedRoutes = express.Router();

feedRoutes.get("/posts", feedController.getPosts);

feedRoutes.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

feedRoutes.get("/post/:postId", feedController.getPost);

module.exports = feedRoutes;
