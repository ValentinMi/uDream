const app = require("express")();
require("dotenv").config();
const port = process.env.PORT;

app.listen(port || 5000, console.log(`Listening on port ${port}...`));
