const { authLogger } = require("../utils/logger");

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  //Here Handle the signup part
  authLogger.info(`User Authenticated : ${email}!`);
  return res.status(200).json({ message: "User Successfully Registered!" });
};
