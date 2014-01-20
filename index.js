


var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.post('/translate', function(req, res){
  res.send('{"hello": "world"}');
});

app.listen(3000);

