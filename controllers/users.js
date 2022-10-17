const { usersLogger } = require("../utils/logger");

exports.getUsers = async (req, res, next) => {
  let results = [...users];
  usersLogger.info(`Fetching the user details!`);
  res.status(200).json({
    message: "Fetch User Details Successfully",
    users: results,
  });
};

// User data in a database
const users = [
  { firstName: "Jane", lastName: "Smith", age: 20 },
  //...
  { firstName: "John", lastName: "Smith", age: 30 },
  { firstName: "Mary", lastName: "Green", age: 50 },
];
