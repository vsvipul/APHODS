var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require("path");
var favicon = require('serve-favicon');
var cors = require('cors');

var publicRoute = require("./routes/index");
var dnsRoute = require("./routes/dns");
var dockerodeRoute = require("./routes/dockerode");

// Enable CORS support
app.use(cors());

const port = 24020;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json({ limit: "30MB", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30MB", extended: true }));

var memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = require('./config/keycloak-config.js').initKeycloak();
app.use(keycloak.middleware({ logout: '/logout'}));

app.engine("html", require("ejs").renderFile);
app.use(favicon(__dirname + '/public/photos/favicon.ico'));
app.use(express.static(path.join(__dirname, "public")))

app.use("/", keycloak.protect(), publicRoute);
app.use("/dns", dnsRoute);
app.use("/dockerode", dockerodeRoute);


app.listen(port, function () {
  console.log('Example app listening on port 24020!');
});
