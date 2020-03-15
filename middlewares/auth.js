const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  if (!config.get("authRequired")) return next();

  const token = req.header("uDream-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
