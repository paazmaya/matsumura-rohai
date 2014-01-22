/**
 * Matsumura Rohai
 * Translate PO files with the help of Microsoft Translate API
 */


var express = require('express');
var

var app = express();
app.use(express.logger());
app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.post('/translate', function(req, res){
  res.send('{"hello": "world"}');
});
app.post('/save-translation', function(req, res) {
  res.send('{"hello": "world"}');
});

// ID could be SHA1 of the Engineering English version, thus one word.

var json = {
  "languages": [
    {
      "lang": "",
      "values": 4
    }
  ],
  "texts": [
    {
      "id": "aeiou12345658",
      "en": "",
      "fi": ""
    }
  ]
};


app.listen(3000);

