'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var DockerManager = require('./src/dockerManager.js');
var dockerManager = new DockerManager();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': false})); 
app.use(bodyParser.json());

app.get('/languages', function(req, res) {
    res.json({'languages': dockerManager.getLanguages()});
    res.end();
});

app.get('/code-examples', function(req, res) {
    res.json({'codeExamples': dockerManager.getCodeExamples()});
    res.end();
});

app.post("/compile", function(req, res) {
    var language = req.body.language;
    var code = req.body.code;
    dockerManager.run(code, language, function(error, stderr, stdout) {
        res.json({'error': error, 'stdout': stdout, 'stderr': stderr});
        res.end();
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(8000, function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log("App listening at port " + port);
});