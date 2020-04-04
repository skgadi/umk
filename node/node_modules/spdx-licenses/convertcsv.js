#!/usr/bin/env node
var fs = require('fs');
var is = require('is2');
var inspect = require('util').inspect;

if (process.argv.legth < 3) {
    console.error('Usage: ./convertcsv.js file');
    process.exit(1);
}
var file = process.argv[2];

var text = fs.readFileSync(file, {encoding: 'utf8'});
if (!is.nonEmptyStr(text)) {
    console.error('Failed to get file contents: '+inspect(text));
    process.exit(2);
}

var licenses = {};

var lines = text.split('\n');
for (var i=0; i<lines.length; i++) {
    // Now we split each line by commas
    var fields = lines[i].split(',', 3);
    fields[2] = fields[2] === 'Y' ? true : false;
    //console.log(i+': '+fields[0],fields[1],fields[2]);
    licenses[fields[1]] = {
        name: fields[0],
        id: fields[1],
        OSIApproved: fields[2]
    };
}

var spdx;
try {
    spdx = JSON.stringify(licenses, null, 4);
} catch(err) {
    console.error('Problem stringifying licenses: '+err.message);
    process.exit(3);
}

fs.writeFileSync('spdx.json', spdx, 'utf8');
console.log('Wrote '+lines.length+' licenses to spdx.json.');
process.exit(0);

