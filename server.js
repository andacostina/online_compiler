'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var uuid = require('uuid/v4');
var constants = require('./src/constants.js');
var DockerManager = require('./src/dockerManager.js');
var dockerManager = new DockerManager();
var SessionManager = require('./src/sessionManager.js');
var sessionManager = new SessionManager(function(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    };

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({'extended': false})); 
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(fileUpload());

    app.get('/languages', function(req, res) {
        res.json({'languages': dockerManager.getLanguages()});
        res.end();
    });

    app.get('/documentation', function(req, res) {
        res.json({'documentation_links': constants.documentationLinks});
        res.end();
    });

    // app.get('/code-examples', function(req, res) {
    //     res.json({'codeExamples': dockerManager.getCodeExamples()});
    //     res.end();
    // });

    app.get('/tree', function(req, res) {
        let cookie = req.cookies.cookie;
        sessionManager.get(cookie, function(err, data) {
            if (data) {
                res.json(data.tree);
                res.end();
            }
            else {
                const tree = [
                    {label: "My scripts", type: "folder", id: '1', children: [
                        {label: "helloworld_2.py", type: "doc", id: '1_1', content: "print \"Hello, World!\"", lang: 'Python2.7'},
                        {label: "helloworld_3.py", type: "doc", id: '1_2', content: "print(\"Hello, World!\")", lang: "Python3.6"},
                        {label: "helloworld.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n};", lang: "C-GNU11"},
                        {label: "helloworld.cpp", type: "doc", id: '1_4', content: "#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", lang: "C++-GNU14"},
                        {label: "HelloWorld.java", type: "doc", id: '1_5', content: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", lang: "Java8"},
                        {label: "Hello.csc", type: "doc", id: '1_6', content: "namespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}", lang: "C#7.0"},
                        {label: "while.pl", type: "doc", id: '1_7', content: "use strict;\n\nmy $a = 5;\nwhile($a > 0) {\n    print \"$a \";\n    $a--;\n}\nprint \"\n\";", lang: "Perl"}
                    ]}
                ];
                var myUUID = uuid();
                var mySession = sessionManager.create(myUUID, tree, function(err) {
                    if (err) {
                        console.error(err);
                    };
                    res.cookie('cookie', myUUID, {maxAge: 1000*60*60*24*30});
                    res.json(tree);
                    res.end();
                });
            };
        });
    });

    app.post('/refresh', function(req, res) {
        if (!req.body.hasOwnProperty('tree')) {
            res.json({'ok': 0});
            return res.end();
        };
        let cookie = req.cookies.cookie;
        sessionManager.update(cookie, req.body.tree, function(err) {
            if (err) {
                console.error(err);
                res.json({'ok': 0});
                return res.end();
            };
            res.json({'ok': 1});
            return res.end();
        });
    });

    app.post("/compile", function(req, res) {
        var language = req.body.language;
        var filename = req.body.filename;
        var code = req.body.code;
        dockerManager.run(code, filename, language, function(error, stderr, stdout) {
            if (error) {
                error = error.message;
                let error_split = error.split('\n');
                error_split.shift();
                error = error_split.join('\n');
            };
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

    var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at port " + port);
    });

});
