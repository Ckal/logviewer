const { authLogger } = require("../utils/logger");

module.exports = (req, res, next) => {
  // Currently checking only Authorization header is there as for simplicity
  // You can implement the rest by adding a jwt authentication
  if (!req.get("Authorization")) {
    authLogger.error("Not Authenticated!");
    return res.status(401).json({ message: "User Not Authenticated!" });
  }
  next();
};
