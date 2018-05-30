'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': false})); 
app.use(bodyParser.json());

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(8000, function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log("App listening at port " + port);
});