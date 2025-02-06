const Express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const routerAuth = Express.Router();

routerAuth.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const cryptoPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: cryptoPassword });
    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerAuth;
