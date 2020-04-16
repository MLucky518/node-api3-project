const express = require("express");
const posts = require("./postDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const postList = await posts.get();
    res.status(200).json(postList);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", validatePostId, (req, res, next) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, async (req, res, next) => {
  try {
    const post = await posts.remove(req.id);
    res.status(200).json({
      message: "User has been deleted",
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", validatePostId, async (req, res) => {
  try{
    const post  = await posts.update(req.id,req.body)
    res.status(200).json({
      message:"post updated"
    })
  }catch(err){
    next(err);
  }

});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const post = await posts.getById(req.params.id);

    if (post) {
      req.post = post;
      req.id = req.params.id;
      next();
    } else {
      res.status(404).json({
        message: "Could not get post",
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = router;
