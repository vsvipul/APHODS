const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Handlebars = require('handlebars');
var helper = {};

helper.addRecord = (subdomain, port) => {
    return new Promise((resolve, reject) => {
        const inputFileStream = fs.createReadStream(path.resolve(__dirname,'../templates/nginx-template.hbs'));
        const outputFileStream = fs.createWriteStream('/etc/nginx/sites-enabled/'+subdomain+'.conf', { flags: 'w+', defaultEncoding: 'utf8' });
        const rl = readline.createInterface({
            input: inputFileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        rl.on('line', (line) => {
            const template = Handlebars.compile(line);
            const contents = template({subdomain, port});
            outputFileStream.write(contents+'\n');
        });
        rl.on('close', function() {
            outputFileStream.close();
            resolve();
        });
    });
}

helper.removeRecord = (subdomain) => {
    return new Promise((resolve, reject) => {
        const path = '/etc/nginx/sites-enabled/'+subdomain+'.conf';
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
                reject();
            }
            resolve();
        });
    });
}

module.exports = helper;