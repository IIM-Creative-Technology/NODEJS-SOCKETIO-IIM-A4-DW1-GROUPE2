const crud = require("../../controller/crud");
var router = require("express").Router();
console.log("test router")
router.post("/add", crud.create);
router.get("/", crud.findAll);
router.get("/:id", crud.findOne);
router.post("/:id", crud.update);
router.delete("/:id", crud.delete);
module.exports = router;
