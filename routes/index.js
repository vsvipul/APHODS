var express = require("express");
var router = express.Router();
var indexControl = require("../controls/index");

router.get("/", indexControl.mainPage);
router.post("/", indexControl.createDeployment);
router.post("/delete", indexControl.deleteDeployment);

module.exports = router;