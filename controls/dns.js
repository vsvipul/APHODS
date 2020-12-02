var helper = {};
const https = require('https');
const config = require("../config/dns-config.json");

helper.addDNSRecord = (subdomain) => {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify([{
                "type": "A",
                "name": subdomain,
                "data": "14.139.34.11",
                "ttl": 3600
            }]);
            const options = {
                hostname: 'api.godaddy.com',
                path: '/v1/domains/iitmandi.co.in/records/',
                port: 443,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'sso-key ' + config.key + ':' + config.secret,
                    'Content-Length': data.length
                }
            }
            const req = https.request(options, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    console.log(data);
                    resolve();
                });
            });
        
            req.on('error', error => {
                console.error(error);
            });
            req.write(data);
            req.end();
        } catch(err) {
            console.log(err);
            reject();
        }
    });
}

helper.getAllDNSRecords = () => {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                hostname: 'api.godaddy.com',
                path: '/v1/domains/iitmandi.co.in/records/',
                port: 443,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'sso-key ' + config.key + ':' + config.secret
                }
            }
            const req = https.request(options, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
        
            req.on('error', error => {
                console.error(error);
            });
            req.end();
        } catch(err) {
            console.log(err);
            reject();
        }
    });
}

helper.replaceAllDNSRecords = (records) => {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify(records);
            const options = {
                hostname: 'api.godaddy.com',
                path: '/v1/domains/iitmandi.co.in/records/',
                port: 443,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'sso-key ' + config.key + ':' + config.secret,
                    'Content-Length': data.length
                }
            }
            const req = https.request(options, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
        
            req.on('error', error => {
                console.error(error);
            });
            req.write(data);
            req.end();
        } catch(err) {
            console.log(err);
            reject();
        }
    });
}

helper.checkDNSRecordAvailable = async(req, res, next) => {
    const subdomain = req.params.id;
    const options = {
        hostname: 'api.godaddy.com',
        path: '/v1/domains/iitmandi.co.in/records/A/' + subdomain,
        port: 443,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'sso-key ' + config.key + ':' + config.secret
        }
    }
    https.get(options, resp => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            const resp = JSON.parse(data);
            res.send(resp[0] == undefined);
        });
    }).on('error', (err) => {
        console.log(err.message);
    });
}

module.exports = helper;