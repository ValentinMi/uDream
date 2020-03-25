const app = require("express")();
require("dotenv").config();
const port = process.env.PORT;

require("./startup/env")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

const server = app.listen(
  port || 5000,
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
