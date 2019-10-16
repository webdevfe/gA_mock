var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

let counter = 0;

app.post('/api', function(req, res) {
  var resData = '';
  counter ++;
  if(counter>7) counter = 1;
  console.log('counter: ', counter);
  let rawdata = fs.readFileSync(__dirname + '/data/data_' + counter + '.json');
  res.json(JSON.parse(rawdata));
  res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
