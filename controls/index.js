var helper = {};
const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

const AppDAO = require('./../dao')
const RevProxy = require('./rev-proxy');
const DNS = require('./dns');
const DeploymentCount = require('./../models/deployment_count')
const DeploymentLimit = require('./../models/deployment_limit')
const DockerDetails = require("./../models/docker_details");
const redis = require('redis');
const { generateHash } = require('random-hash');
const client = redis.createClient();

var Docker = require('dockerode');
const Dockerode = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

helper.mainPage = async(req, res, next) => {
    const userid = req.kauth.grant.access_token.content.preferred_username;
    const name = req.kauth.grant.access_token.content.given_name;
    const dao = new AppDAO('database.sqlite3');
    const dockerDetails = new DockerDetails(dao);
    const deplLimit = new DeploymentLimit(dao);
    const deplCount = new DeploymentCount(dao);
    deplLimit.getCount()
    .then((limit) => {
        deplCount.getCount()
        .then((count) => {
            dockerDetails.getDetails(userid)
            .then((details) => {
                if (details == undefined && count.val < limit.val) {
                    // No current deployment and there is space for new deployment
                    res.render("index", {
                        userid,
                        name,
                        count: count.val,
                        limit: limit.val,
                    });
                } else if (details == undefined && count.val == limit.val){
                    // No current deployment and there is no space for new deployment
                    res.render("capacity_full", {
                        userid,
                        name,
                        count: count.val,
                        limit: limit.val,
                    });
                } else {
                    // Deployment for user exists
                    res.render("deployment_details", {
                        userid,
                        name,
                        details,
                        count: count.val,
                        limit: limit.val,
                    });
                }
            })
        });
    });
}

// const dockerRun = (command, res) => {
//     const childProcess = exec(command, (error, stdout, stderr) => {
//         if (error==null)
//         res.render('postsubmit', {message: 'Container is running!', details: {}});
//         else res.render('postsubmit', {message: 'Docker run failed!', error: {command, stdout, stderr}});
//     });
// }

helper.stopContainer = (containerid) => {
    return new Promise((resolve, reject) => {
        exec("docker stop " + containerid, (error, stdout, stderr) => {
            if (error==null) resolve();
            else reject();
        });
    });
}

helper.getNewContainer = (res,formdata) => {
    return new Promise((resolve, reject) =>  {
        let containerNum = generateHash({length: 10});
        let command = "docker run -";
        command += formdata.optradioRunMode;
        command += (" -p " + formdata.port);
        console.log(formdata);
        if (formdata.optradio == "dockerfile") {
            // Do this if dockerfile selected
            // Use formdata.dockerfileLink
            fs.mkdirSync("./containers/" + containerNum, { recursive: true });
            const file = fs.createWriteStream("./containers/"+containerNum + "/Dockerfile");
            command += (" autohosting"+ containerNum);
            const request = https.get(formdata.dockerfileLink, function(response) {
                response.pipe(file);
                process.chdir("./containers/"+containerNum);
                const buildProcess = exec("docker build -t autohosting"+ containerNum + " . ", (error, stdout,stderr) => {
                    process.chdir("../..");
                    if (error==null)
                    {
                        const runProcess = exec(command, (error, stdout, stderr) => {
                            if (error==null) resolve(stdout.split("\n")[0]);
                            else 
                            {
                                res.render('postsubmit', {message: 'Docker run failed!', error: {command, stdout, stderr}});
                                reject(stderr);
                            }
                        });
                    }
                    else 
                    {
                        res.render('postsubmit', {message: 'Error building Dockerfile', error: {command: ("docker build") , stdout, stderr}});
                        reject(stderr);
                    }
                });
                buildProcess.stdout.pipe(process.stdout);
                buildProcess.stderr.pipe(process.stderr);
            });
        } else if (formdata.optradio == "dockerImage") {
            // Do this if dockerImage selected
            // Use formdata.dockerImage
            command += (" " + formdata.dockerImage);
            const pullProcess = exec("docker pull " + formdata.dockerImage, (error, stdout, stderr)=> {
                if (error==null) {
                    const runProcess = exec(command, (error, stdout, stderr) => {
                        if (error==null) resolve(stdout.split("\n")[0]);
                        else {
                            res.render('postsubmit', {message: 'Docker run failed!', error: {command, stdout, stderr}});
                            reject(stderr);
                        }
                    });
                }
                else {
                    res.render('postsubmit', {message: 'Error pulling image', error: {command: ("docker pull " + formdata.dockerImage) , stdout, stderr}});
                    reject(stderr);
                }
            });
        }
    });
}

helper.createDeployment = async(req, res, next) => {
    /*
    Tasks to do when creating a deployment - 
    1. Building and running the docker container.
    2. Getting SSH Details for the container.
    3. Use DNS API to add entry in DNS Server.
    4. Use rev-proxy API to create nginx record file.
    5. Insert details (along with SSH Details) in docker_details.
    6. Increase count in deployment_count.
    7. Render the home page again. 
    It will automatically show the details of the container along with option to delete it.
    */
    const formdata = req.body;
    const { subdomain, port  } = formdata;
    const userid = req.kauth.grant.access_token.content.preferred_username;
    const dao = new AppDAO('database.sqlite3');
    const dockerDetails = new DockerDetails(dao);
    const deplCount = new DeploymentCount(dao);

    // Step 1
    helper.getNewContainer(res, formdata)
    .then((containerid) => {
        console.log(containerid);
        const passwd = generateHash({length: 10});
        client.set("dockssh:" + containerid + ":pass", passwd, ()=>{
    // Step 3
            DNS.addDNSRecord(subdomain)
            .then(() => {
                // Step 4
                RevProxy.addRecord(subdomain, port)
                .then(() => {
                    // Step 5
                    // TODO Add along with formdata with whatever user needs to see about the container
                    dockerDetails.insertDetail(userid, containerid, subdomain, port, passwd)
                    .then(() => {
                        // Step 6
                        deplCount.increaseCount()
                        .then(()=> {
                            // Step 7
                            res.redirect('back');
                        });
                    });
                });
            });
        });
    }).catch((error)=>{console.log(error)});
}

helper.deleteDeployment = async(req, res, next) => {
    /*
    Tasks to do when deleting a deployment - 
    1. Stopping and deleting the container.
    2. Removing ssh details from whatever app we use to get the ssh access.
    3. Use DNS API to remove entry in DNS Server. (Not possible with current API. 
        Fetched all records and then removed the specific record from array and then replaced all to achieve this.)
    4. Use rev-proxy API to delete nginx record file.
    5. Deleting container details in docker_details.
    6. Decrease count in deployment_count.
    7. Render the home page again. 
    It will automatically load the index page with options to create a new deployment.
    */
    const userid = req.kauth.grant.access_token.content.preferred_username;
    const dao = new AppDAO('database.sqlite3');
    const dockerDetails = new DockerDetails(dao);
    const deplCount = new DeploymentCount(dao);


    dockerDetails.getDetails(userid)
    .then((details) => {
        console.log(details);
        helper.stopContainer(details.containerid).then(()=>{
            client.del("dockssh:" + details.containerid + ":pass", ()=>{
                return details.subdomain;
            });
        });
    })
    .then((subdomain) => {
        // Step 3 1st part
        DNS.getAllDNSRecords(subdomain)
        .then((records) => {
            var recordsArr = JSON.parse(records);
            return recordsArr.filter((item) => item.name !== subdomain);
        })
        .then((records) => {
            // Step 3 2nd part
            DNS.replaceAllDNSRecords(records)
            .then(() => {
                // Step 4
                RevProxy.removeRecord(subdomain)
                .then(() => {
                    // Step 5
                    dockerDetails.removeDetails(userid)
                    .then(() => {
                        // Step 6
                        deplCount.decreaseCount()
                        .then(()=> {
                            // Step 7
                            res.redirect('back');
                        });
                    });
                });
            });
        });
    });
}

module.exports = helper;