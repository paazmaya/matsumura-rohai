/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';



var Gettext = require('node-gettext');
var MsTranslator = require('mstranslator');


var gt = new Gettext();
var translateClient = new MsTranslator({
  client_id: process.env.MS_TRANSLATE_API_KEY || '',
  client_secret: process.env.MS_TRANSLATE_API_SECRET || ''
});



// When was the token last time received, unix time
var lastTokenTime = 0;

var translate = function (from, to, text, translateCallback) {
  var now = Math.round(Date.now() / 1000); // instead of ms, just full seconds
  var params = {
    text: text,
    from: from,
    to: to
  };
  // If token is older than 9 minutes, refresh it first
  if (now > 540 + lastTokenTime) {
    translateClient.initialize_token(function () {
      lastTokenTime = now;
      translateClient.translate(params, function (err, data) {
        translateCallback(data);
      });
    });
  }
  else {
    // Should be fine to use existing token..
    translateClient.translate(params, function (err, data) {
      translateCallback(data);
    });
  }
};
