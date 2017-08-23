/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';

const Gettext = require('node-gettext');
const MsTranslator = require('mstranslator');

const gt = new Gettext();
let translateClient;

// When was the token last time received, unix time
let lastTokenTime = 0;

/**
 * Initialises the API client
 * @returns {void}
 */
const init = function () {
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
const translate = function (from, to, text, translateCallback) {
  const now = Math.round(Date.now() / 1000); // instead of ms, just full seconds
  const params = {
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
