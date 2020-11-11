const https = require('https');
const config = require("../config.json");

function addDNSRecord(subdomain) {
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
            });
        });
    
        req.on('error', error => {
            console.error(error);
        });
        req.write(data);
        req.end();
    } catch(err) {
        console.log(err);
    }
}

function checkIfDNSRecordAvailable(subdomain) {
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
    https.get(options, res => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const res = JSON.parse(data);
            return res[0] == undefined;
        });
    }).on('error', (err) => {
        console.log(err.message);
    });
}

//checkIfDNSRecordAvailable('astrax');
//checkIfDNSRecordAvailable('test2343');
// addDNSRecord("test2345");