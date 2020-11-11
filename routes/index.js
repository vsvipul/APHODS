var express = require("express");
var router = express.Router();
var indexControl = require("../controls/index");

router.get("/", indexControl.mainPage);
router.post("/", indexControl.handleQuery);

module.exports = router;