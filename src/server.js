const Express = require("express");
const routerAuth = require("./routes/auth");
const database = require("./config/db");
require("dotenv").config();

const app = Express();

const PORT = process.env.PORT;

app.use(Express.json());
app.use("/api/auth", routerAuth);

database.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
