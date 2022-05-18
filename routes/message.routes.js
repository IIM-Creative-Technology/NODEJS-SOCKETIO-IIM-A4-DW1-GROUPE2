const { addMessage, getMessages } = require("../controller/message");
const router = require("express").Router();

router.post("/get-msg", getMessages);
router.post("/", addMessage);

module.exports = router;