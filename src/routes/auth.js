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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({
      authenticated: true,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({ authenticated: false, message: error.message });
  }
});

routerAuth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ authenticated: true, token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ authenticated: false, message: error.message });
  }
});

routerAuth.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.status(200).json({ message: "TOken deleted. Logout successful" });
});

module.exports = routerAuth;
