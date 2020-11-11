const https = require('https');
const config = require("../config.json");

function addDNSRecord(subdomain) {
    try {
        console.log(config.key);
        console.log(config.secret);
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
            console.log(`statusCode: ${res.statusCode}`);
            console.log('headers:', res.headers);
            res.on('data', d => {
                console.log(d);
            });
        })
    
        req.on('error', error => {
            console.error(error);
        });
        req.write(data);
        req.end();
    } catch(err) {
        console.log(err);
    }
   
}

//addDNSRecord("test234");