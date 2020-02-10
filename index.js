const app = require("express")();
require("dotenv").config();
const port = process.env.PORT;

require("./startup/routes")(app);
require("./startup/db")();

app.listen(port || 5000, console.log(`Listening on port ${port}...`));
