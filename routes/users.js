const express = require("express");
const userController = require("../controllers/users");
const router = express.Router();
const isauth = require("../middleware/is-auth");

router.get("/users", isauth, userController.getUsers);

module.exports = router;
