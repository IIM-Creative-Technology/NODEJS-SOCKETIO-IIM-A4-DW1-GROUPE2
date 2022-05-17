const user = require("../controller/user");
const verifyToken = require("./auth/verifyToken");
const router = require("express").Router();

router.get("/get-user", verifyToken, user.findOne);

module.exports = router;