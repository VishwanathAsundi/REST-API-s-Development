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

feedRoutes.put(
  "/post/:postId",
  [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

feedRoutes.delete("/post/:postId", feedController.deletePost);

module.exports = feedRoutes;
