const express = require("express");

const feedController = require("../controllers/feed");

const feedRoutes = express.Router();

feedRoutes.get("/posts", feedController.getPosts);

feedRoutes.post("/post", feedController.createPost);

module.exports = feedRoutes;
