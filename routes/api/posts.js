const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

//@route    GET api/posts
//@desc     Get all the posts
//@access   Private

router.get("/", auth, async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ date: -1 });
    res.json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//@route    GET api/posts/:id
//@desc     Get post with id
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "No such post!" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No such post!" });
    }
    res.status(500).send("Server error");
  }
});

//@route    DELETE api/posts
//@desc     DELETE post
//@access   Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "You can't delete this post!" });
    }

    await post.remove();

    res.json({ msg: "Post deleted succesfully" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No such post!" });
    }
    res.status(500).send("Server error");
  }
});

//@route    PUT api/posts/like/:id
//@desc     Add like to a post
//@access   Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "You already liked this post." });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error.");
  }
});

//@route    PUT api/posts/unlike/:id
//@desc     Remove like from a post
//@access   Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked." });
    }

    // get remove index

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error.");
  }
});

//@route    POST api/posts/comment/:id
//@desc     Create comment
//@access   Private
router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete a comment
//@access   Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found!" });
    }

    // Check User
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You are not allowed to remove this comment!" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
