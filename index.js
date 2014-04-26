/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */
'use strict';


var express = require('express');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

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

var app = express();
app.use(morgan());
app.use(bodyParser());
app.use(serveStatic(__dirname + '/static', {maxAge: 1000 * 60 * 60 * 24 * 7})); // A week in milliseconds

app.post('/translate', function(req, res) {
  var from = req.param('from');
  var to = req.param('to');
  var content = req.param('content');

  res.set('Content-Type', 'application/json');
  translate(from, to, content, function (translated) {
    res.send(JSON.stringify({translated: translated}));
  });
});

app.post('/save-translation', function(req, res) {
  res.send(JSON.stringify({hello: 'world'}));
});

// ID could be SHA1 of the Engineering English version, thus one word.

var initialData = {
  languages: [
    {
      lang: 'en',
      values: 4
    }
  ],
  translations: [
    {
      id: 'aeiou12345658',
      texts: [
        {
          lang: 'en',
          text: ''
        },
        {
          lang: 'fi',
          text: ''
        }
      ]
    }
  ]
};

app.get('/initial-data', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(initialData));
});



app.listen(process.env.PORT || 3000);

