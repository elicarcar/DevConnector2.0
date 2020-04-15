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

module.exports = router;
