const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 1;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({ posts: posts, totalItems: totalItems });
    })
    .catch(e => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({ message: "Unprocessible entity", errors: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;

  //   if (!req.file) {
  //     const error = new Error("File is not attached");
  //     error.statusCode = 422;
  //     throw error;
  //   }
  //   const imageUrl = req.file.path;
  //   console.log(imageUrl, "imageUrl");

  let post = new Post({
    title: title,
    content: content,
    imageUrl: "images/vishwa.jpeg",
    creator: {
      name: "vish"
    }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result
      });
    })
    .catch(e => {
      console.log(e);
    });
};
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetch is success", post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.updatePost = (req, res, next) => {
  const postId = req.body.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({ message: "Unprocessible entity", errors: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  Post.findById(postId)
    .then(post => {
      if (req.file) {
        imageUrl = req.file.path;
        if (imageUrl !== post.imageUrl) {
          clearImage(post.imageUrl);
        }
      }
      if (!imageUrl) {
        const error = new Error("File is not attached");
        error.statusCode = 422;
        throw error;
      }

      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: "Post Updated successfully", post: result });
    })
    .catch(e => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      // look for loggen in user and author of the post
      return Post.findByIdAndDelete(postId);
    })
    .then(result => {
      res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch(e => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => {
    console.log(err);
  });
};
