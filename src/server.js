const Express = require("express");
const routerAuth = require("./routes/auth");
const database = require("./config/db");
const middlewareAuth = require("./middleware/authentication");
const User = require("./models/user");
require("dotenv").config();
const cookieParse = require("cookie-parser");
const routerPost = require("./routes/post");

const PORT = process.env.PORT;

const app = Express();

app.use(cookieParse());
app.use(Express.json());
app.use("/api/auth", routerAuth);
app.use("/api", middlewareAuth.routerProtected);
app.use("/api/posts", routerPost);

database.sync({ force: false }).then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
