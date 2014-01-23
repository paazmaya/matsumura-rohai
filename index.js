/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */



var express = require('express');
var Gettext = require('node-gettext');
var MsTranslator = require('mstranslator');

var gt = new Gettext();
var translateClient = new MsTranslator({
  client_id: '',
  client_secret: ''
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
app.use(express.logger());
app.use(express.json());
app.use(express.static(__dirname + '/static'));


app.post('/translate', function(req, res) {
  req.param('from')

  res.set('Content-Type', 'application/json');
  translate(req.param('from'), req.param('to'), req.param('content'), function (translated) {
    res.send('{"translated": "' + translated + '"}');
  });
});

app.post('/save-translation', function(req, res) {
  res.send('{"hello": "world"}');
});

// ID could be SHA1 of the Engineering English version, thus one word.

var json = {
  "languages": [
    {
      "lang": "en",
      "values": 4
    }
  ],
  "translations": [
    {
      "id": "aeiou12345658",
      "texts": [
        {
          "lang": "en",
          "text": ""
        },
        {
          "lang": "fi",
          "text": ""
        }
      ]
    }
  ]
};

app.get('/initial-data', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(json));
});



app.listen(3000);

