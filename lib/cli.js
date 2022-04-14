/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */


const fs = require('fs');
const util = require('util');

// https://github.com/chevex/yargs
const yargs = require('yargs');

const pkg = (function jsonFileRead(filename) {
  if (!fs.existsSync(filename)) {
    return false;
  }
  const data = fs.readFileSync(filename, {
    encoding: 'utf8'
  });

  // TODO: error checking, file exists...
  return JSON.parse(data);
})('../package.json');

if (pkg === false) {
  util.error('Could not read package.json');
  process.exit(-1);
}

const ver = 'v' + pkg.version + ' - ' + pkg.author.name +
  ' <' + pkg.author.email + '> - Licensed under ' +
  pkg.licenses.shift().type + ' license';

const defaultPort = 3000;

// Skip first two arguments since they are `node` and the this script filename.
const args = yargs.usage(pkg.name + ' - ' + pkg.description)
  .alias('version', 'V')
  .version(ver, 'version', 'Show version, license and copyright information')
  .alias('help', 'h')
  .help('help', 'Ummm....')
  .showHelpOnFail(true, 'Lost you is.')
  .describe('license', 'Show complete license information')
  .alias('port', 'p')
  .describe('port', 'Port in which the local server will be started, defaults to ' + defaultPort)
  .alias('key', 'k')
  .describe('key', 'Microsoft Translate API key')
  .alias('secret', 's')
  .describe('secret', 'Microsoft Translate API secret')
  .usage('Use example: node index.js serve --key 24242445 --secret 3523552')
  .argv;

util.log(util.inspect(args));


if (args.license) {
  const license = fs.readFileSync('LICENSE-MIT');
  console.log(license);
}
else if (args._.indexOf('serve') !== -1) {
  if (!args.key || !args.secret || typeof args.key !== 'string' || typeof args.secret !== 'string') {
    util.error('Microsoft Translate API key/secret were not defined');
    process.exit(-1);
  }
  global.api_key = args.key;
  global.api_secret = args.secret;

  // Start Express server
  const server = require('./server.js');
  const port = args.port || defaultPort;
  server.listen(port);
}
