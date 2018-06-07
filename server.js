'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
const fileUpload = require('express-fileupload');

var constants = require('./src/constants.js');
var DockerManager = require('./src/dockerManager.js');
var dockerManager = new DockerManager();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': false})); 
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/languages', function(req, res) {
    res.json({'languages': dockerManager.getLanguages()});
    res.end();
});

app.get('/code-examples', function(req, res) {
    res.json({'codeExamples': dockerManager.getCodeExamples()});
    res.end();
});

app.get('/tree', function(req, res) {
    res.json([
        {label: "My scripts", type: "folder", id: '1', children: [
            {label: "helloworld_2.py", type: "doc", id: '1_1', content: "print \"Hello, World!\"", lang: 'Python2'},
            {label: "helloworld_3.py", type: "doc", id: '1_2', content: "print(\"Hello, World!\")", lang: "Python3"},
            {label: "helloworld.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n};", lang: "C"},
            {label: "helloworld.cpp", type: "doc", id: '1_4', content: "#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", lang: "C++"},
            {label: "HelloWorld.java", type: "doc", id: '1_5', content: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", lang: "Java"},
            {label: "Hello.csc", type: "doc", id: '1_6', content: "namespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}", lang: "C#"}
        ]}
    ]);
    res.end();
});

app.post("/compile", function(req, res) {
    var language = req.body.language;
    var filename = req.body.filename;
    var code = req.body.code;
    dockerManager.run(code, filename, language, function(error, stderr, stdout) {
        if (error) error = error.message;
        res.json({'error': error, 'stdout': stdout, 'stderr': stderr});
        res.end();
    });
});

app.post("/upload", function(req, res) {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No files were uploaded.');
    };
    res.json({'name': req.files.file.name, 'content': req.files.file.data.toString('utf8')});
    res.end();
});

app.get('/memory_limit', function(req, res) {
    res.json({'memoryLimit': constants.memoryLimit});
    res.end();
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(8000, function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log("App listening at port " + port);
});
