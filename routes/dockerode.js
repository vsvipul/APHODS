var express = require("express");
var router = express.Router();
var dockerodeControl = require("../controls/dockerode");

router.get("/ports", dockerodeControl.getAllUsedPorts);

module.exports = router;