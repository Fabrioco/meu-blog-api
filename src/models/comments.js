const { DataTypes } = require("sequelize");
const database = require("../config/db");
const Post = require("./post");
const User = require("./user");

const Comment = database.define(
  "comments",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Post.hasMany(Comment, { foreignKey: "post_id", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "post_id" });
module.exports = Comment;
