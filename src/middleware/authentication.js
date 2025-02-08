require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Express = require("express");
const routerProtected = Express.Router();

const middlewareAuth = async (req, res, next) => {
  const token = req.cookies.token;
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

routerProtected.get("/protected", middlewareAuth, (req, res) => {
  res.status(200).json({ authenticated: true });
});

module.exports = { middlewareAuth, routerProtected };
