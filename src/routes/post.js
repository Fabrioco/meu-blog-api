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

routerPost.delete("/comment/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id } });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.user_id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await comment.destroy();
  res.status(200).json({ message: "Comment deleted successfully" });
});

routerPost.put("/comment/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const commentUpdated = await Comment.update({ comment }, { where: { id } });
  res.status(200).json({ commentUpdated });
});
  


routerPost.put("/like/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = Array.isArray(post.likes) ? post.likes : [];

    const isLiked = post.likes.includes(req.user.id);
    if (isLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes = [...post.likes, req.user.id];

    await post.update({ likes: post.likes });
    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyLike = async (post_id, user_id) => {
  try {
    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      return false;
    }
    const isLiked = post.likes.includes(user_id);
    return isLiked;
  } catch (error) {
    console.error(error);
    return false;
  }
};

routerPost.put("/dislike/:id", middlewareAuth, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isLiked = await verifyLike(id, req.user.id);
  if (!isLiked) {
    return res.status(400).json({ message: "Post not liked" });
  }

  post.likes = post.likes.filter((like) => like !== req.user.id);
  await post.save();
  res.status(200).json({ post });
});

module.exports = routerPost;
