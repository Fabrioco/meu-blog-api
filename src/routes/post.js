const Express = require("express");
const Post = require("../models/post");
const { middlewareAuth } = require("../middleware/authentication");
const Comment = require("../models/comments");
const routerPost = Express.Router();

routerPost.get("/all", async (req, res) => {
  const posts = await Post.findAll();
  res.status(200).json({ posts });
});

routerPost.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json({ post });
});

routerPost.post("/create", middlewareAuth, async (req, res) => {
  const { title, description, image } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const post = await Post.create({
    title,
    description,
    image,
    user_id: req.user.id,
  });
  res.status(201).json({ post });
});

routerPost.put("/update/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.user_id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  post.title = title;
  post.description = description;
  post.image = image;
  await post.save();
  res.status(200).json({ post });
});

routerPost.delete("/delete/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.user_id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await post.destroy();
  res.status(200).json({ message: "Post deleted successfully" });
});

routerPost.post("/comment", middlewareAuth, async (req, res) => {
  try {
    const { post_id, comment } = req.body;
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentCreated = await Comment.create({
      comment,
      post_id,
      user_id: req.user.id,
    });

    res.status(201).json({ commentCreated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

routerPost.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: {
        post_id: postId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerPost;
