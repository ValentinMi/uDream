const express = require("express");
const users = require("../routes/users");
const dreams = require("../routes/dreams");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/dreams", dreams);
};
