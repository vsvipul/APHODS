const AppDAO = require('./dao');
const DeploymentCount = require('./models/deployment_count');
const DeploymentLimit = require('./models/deployment_limit');
const DockerDetails = require('./models/docker_details');

const dao = new AppDAO('./database.sqlite3')
const deplCount = new DeploymentCount(dao);
const deplLimit = new DeploymentLimit(dao);
const dockerDetails = new DockerDetails(dao);

deplCount.createTable()
    .then(() => {
        deplCount.initCount()
    });

deplLimit.createTable()
    .then(() => {
        deplLimit.setCount(5);
    });

dockerDetails.createTable();