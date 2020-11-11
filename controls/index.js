var helper = {};
const https = require('https');
const fs = require('fs');

let containerId = 0; // How to keep this persistent?


helper.mainPage = async(req, res, next) => {
    res.render("index");
}

helper.handleQuery = async(req, res, next) => {
    const formdata = req.body;
    console.log(formdata.repoLink);
    console.log(formdata.subdomain);
    console.log(formdata.port);
    fs.mkdirSync("./containers/"+(containerId+1), {recursive: true});
    const file = fs.createWriteStream("./containers/"+(containerId+1) + "/Dockerfile");
    const request = https.get(formdata.repoLink, function(response) {
        response.pipe(file);
    });
    res.render('index');
}

module.exports = helper;