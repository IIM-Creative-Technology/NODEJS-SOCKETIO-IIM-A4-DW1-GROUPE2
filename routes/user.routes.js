const user = require("../controller/user");
const verifyToken = require("./auth/verifyToken");
const router = require("express").Router();

router.get("/get-user", verifyToken, user.findOne);
router.get("/", verifyToken, user.findAll);

module.exports = router;