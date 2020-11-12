var helper = {};
const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

let containerId = 0; 

helper.mainPage = async(req, res, next) => {
    res.render("index");
}

helper.handleQuery = async(req, res, next) => {
    containerId++;
    const formdata = req.body;
    console.log(formdata.dockerfileLink);
    console.log(formdata.subdomain);
    console.log(formdata.port);
    fs.mkdirSync("./containers/" + containerId, { recursive: true });
    const file = fs.createWriteStream("./containers/"+containerId + "/Dockerfile");
    const request = https.get(formdata.dockerfileLink, function(response) {
        response.pipe(file);
        process.chdir("./containers/"+containerId);
        const childProcess = exec("docker build -t c"+ containerId + " . && docker run -it c" + containerId);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        process.chdir("../..");
    });
    res.render('index');
}

module.exports = helper;