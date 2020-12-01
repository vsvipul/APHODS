var helper = {};
const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

let containerId = 0; 

helper.mainPage = async(req, res, next) => {
    res.render("index");
}

const dockerRun = (command, res) => {
    const childProcess = exec(command, (error, stdout, stderr) => {
        if (error==null)
        res.render('postsubmit', {message: 'Container is running!', details: {}});
        else res.render('postsubmit', {message: 'Docker run failed!', error: {command, stdout, stderr}});
    });
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
}


helper.handleQuery = async(req, res, next) => {
    containerId++;
    const formdata = req.body;
    // console.log(formdata.dockerfileLink);
    // console.log(formdata.subdomain);
    // console.log(formdata.port);
    console.log(formdata);
    if (formdata.optradio == "dockerfile") {
        // Do this if dockerfile selected
        // Use formdata.dockerfileLink
        // fs.mkdirSync("./containers/" + containerId, { recursive: true });
        // const file = fs.createWriteStream("./containers/"+containerId + "/Dockerfile");
        // const request = https.get(formdata.dockerfileLink, function(response) {
        //     response.pipe(file);
        //     process.chdir("./containers/"+containerId);
        //     const childProcess = exec("docker build -t c"+ containerId + " . && docker run -it c" + containerId);
        //     childProcess.stdout.pipe(process.stdout);
        //     childProcess.stderr.pipe(process.stderr);
        //     process.chdir("../..");
        // });
    } else if (formdata.optradio == "dockerImage") {
        // Do this if dockerImage selected
        // Use formdata.dockerImage
        res.render('postsubmit', {message: 'Pulling Docker image'}, () => {
            let command = "docker run -";
            command += formdata.optradioRunMode;
            command += (" -p " + formdata.port);
            command += (" " + formdata.dockerImage);
            const pullProcess = exec("docker pull " + formdata.dockerImage, (error, stdout, stderr)=> {
                if (error==null) {
                    res.render('postsubmit', {message: 'Starting container'} , () => {
                        console.log(command);
                        dockerRun(command, res);
                    });
                }
                else res.render('postsubmit', {message: 'Error pulling image', error: {command: ("docker pull " + formdata.dockerImage) , stdout, stderr}});
            });
        });
    }
}

module.exports = helper;