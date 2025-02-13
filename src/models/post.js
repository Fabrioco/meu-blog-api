const { DataTypes } = require("sequelize");
const database = require("../config/db");

const Post = database.define("posts", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Post;
