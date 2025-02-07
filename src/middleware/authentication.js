require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const middlewareAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = middlewareAuth;
