/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

var util = require('util');

// https://github.com/chevex/yargs
var yargs = require('yargs');

var version = '0.1.0';

// Skip first two arguments since they are `node` and the this script filename.
var args = yargs.usage('Translate PO files with the help of Microsoft Translate API')
  .alias('version', 'V')
  .version(version, 'version', 'Version information')
  .alias('help', 'h')
  .help('help', 'Ummm....')
  .showHelpOnFail(true, 'Lost you is.')
  .argv;

util.log(util.inspect(args));


