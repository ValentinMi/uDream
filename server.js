const app = require("express")();
require("dotenv").config();
const port = process.env.PORT;

require("./startup/env")();
require("./startup/routes")(app);
require("./startup/db")();

app.listen(port, console.log(`Listening on port ${port}...`));
