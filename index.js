var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var favicon = require('serve-favicon');

var publicRoute = require("./routes/index");
var dnsRoute = require("./routes/dns");

const port = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json({ limit: "30MB", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30MB", extended: true }));
app.engine("html", require("ejs").renderFile);
app.use(favicon(__dirname + '/public/photos/favicon.ico'));
app.use(express.static(path.join(__dirname, "public")))

app.use("/", publicRoute);
app.use("/dns", dnsRoute);

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});