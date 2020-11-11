var express = require("express");
var router = express.Router();
var dnsControl = require("../controls/dns");

router.get("/:id", dnsControl.checkDNSRecordAvailable);

module.exports = router;