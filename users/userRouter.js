const express = require("express");
const users = require("./userDb");
const posts = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res,next) => {
  users
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  posts
    .insert({ ...req.body, user_id: req.id })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/", (req, res,next) => {
  users
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", validateUserId, (req, res,next) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res,next) => {
  users
    .getUserPosts(req.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:id", validateUserId, (req, res,next) => {
  users
    .remove(req.id)
    .then((count) => {
      res.status(200).json({
        message: " user deleted ",
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res,next) => {
  users
    .update(req.id, req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

//custom middleware

function validateUserId(req, res, next) {
  users
    .getById(req.params.id)

    .then((user) => {
      if (user) {
        req.user = user;
        req.id = req.params.id;
        next();
      } else {
        res.status(400).json({
          message: "Invalid user id",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      message: "Missing user name",
    });
  }
  if (!req.body) {
    return res.status(400).json({
      message: "Missing user body",
    });
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    return res.status(400).json({
      message: "Missing user title",
    });
  }
  if (!req.body) {
    return res.status(400).json({
      message: "Missing user body",
    });
  }
  next();
}

module.exports = router;
