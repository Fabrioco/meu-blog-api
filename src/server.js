const Express = require("express");
const routerAuth = require("./routes/auth");
const database = require("./config/db");
const middlewareAuth = require("./middleware/authentication");
const User = require("./models/user");
require("dotenv").config();

const app = Express();

const PORT = process.env.PORT;

app.use(Express.json());
app.use("/api/auth", routerAuth);

app.use("/api/protected", middlewareAuth, (req, res) => {
  res.status(200).json({ message: "Authorized", user: req.user });
  next();
});

database.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
