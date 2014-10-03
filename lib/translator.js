/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

var Gettext = require('node-gettext');
var MsTranslator = require('mstranslator');

var gt = new Gettext();
var translateClient;

// When was the token last time received, unix time
var lastTokenTime = 0;

/**
 * Initialises the API client
 * @returns {void}
 */
var init = function () {
  translateClient = new MsTranslator({
    client_id: global.api_key,
    client_secret: global.api_secret
  });
};

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {string} text
 * @param {function} translateCallback
 * @returns {void}
 */
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

module.exports = {
  translate: translate,
  init: init
};
