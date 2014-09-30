/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

var fs = require('fs');
var util = require('util');

// https://github.com/chevex/yargs
var yargs = require('yargs');

var pkg = (function (filename) {
  var data = fs.readFileSync(filename, {encoding: 'utf8'});
  // TODO: error checking, file exists...
  return JSON.parse(data);
}('package.json'));

var ver = 'v' + pkg.version + ' - ' + pkg.author.name +
  ' <' + pkg.author.email + '> - Licensed under ' +
  pkg.licenses.shift().type + ' license';

// Skip first two arguments since they are `node` and the this script filename.
var args = yargs.usage(pkg.name + ' - ' + pkg.description)
  .alias('version', 'V')
  .version(ver, 'version', 'Show version, license and copyright information')
  .alias('help', 'h')
  .help('help', 'Ummm....')
  .showHelpOnFail(true, 'Lost you is.')
  .describe('license', 'Show complete license information')
  .argv;

util.log(util.inspect(args));


if (args.license) {
  var license = fs.readFileSync('LICENSE-MIT');
  util.log(license);
}
