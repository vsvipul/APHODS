const fs = require('fs');
const readline = require('readline');
const Handlebars = require('handlebars');

function addRecord(subdomain, port) {
    const inputFileStream = fs.createReadStream('../templates/nginx-template.hbs');
    const outputFileStream = fs.createWriteStream('/etc/nginx/sites-enabled/'+subdomain, { flags: 'r+', defaultEncoding: 'utf8' });
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
    })
}