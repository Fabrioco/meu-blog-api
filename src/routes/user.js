const Express = require("express");
const User = require("../models/user");
const routerUser = Express.Router();

routerUser.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerUser;
