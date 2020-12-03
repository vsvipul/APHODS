var helper = {};
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

helper.getAllUsedPorts = async(req, res, next) => {
    docker.listContainers({all: true}, function(err, containers) {
        ports = [];
        for (container of containers) {
            console.log(container['Ports']);
            for (port of container['Ports']) {
                ports.push(port['PublicPort']);
            }
        }
        res.send(ports);
    });
}

module.exports = helper;