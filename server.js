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
                        {label: "helloworld_2.py", type: "doc", id: '1_1', content: "print \"Hello, World!\"", lang: 'Python 2.7'},
                        {label: "helloworld_3.py", type: "doc", id: '1_2', content: "print(\"Hello, World!\")", lang: "Python 3.6"},
                        {label: "helloworld.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n};", lang: "C GNU 11"},
                        {label: "helloworld.cpp", type: "doc", id: '1_4', content: "#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", lang: "C++ GNU 14"},
                        {label: "HelloWorld.java", type: "doc", id: '1_5', content: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", lang: "Java 8"},
                        {label: "Hello.csc", type: "doc", id: '1_6', content: "namespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}", lang: "C# 7.0"},
                        {label: "while.pl", type: "doc", id: '1_7', content: "use strict;\n\nmy $a = 5;\nwhile($a > 0) {\n    print \"$a \";\n    $a--;\n}\nprint \"\n\";", lang: "Perl 5.26"},
                        {label: "iter.rb", type: "doc", id: '1_8', content: "# Here's a different way to add up an array.\nfred = [ 4, 19, 3, 7, 32 ]\nsum = 0\nfred.each { |i| sum += i }\nprint \"Sum of [\", fred.join(\" \"), \"] is #{sum}\n\"\n\n# Or create a secret message.\nkey = { 'A' => 'U', 'B' => 'Q', 'C' => 'A', 'D' => 'F', 'E' => 'D', 'F' => 'K',\n        'G' => 'P', 'H' => 'W', 'I' => 'N', 'J' => 'L', 'K' => 'J', 'L' => 'M',\n        'M' => 'S', 'N' => 'V', 'O' => 'Y', 'P' => 'O', 'Q' => 'Z', 'R' => 'T',\n        'S' => 'E', 'T' => 'I', 'U' => 'X', 'V' => 'B', 'W' => 'G', 'X' => 'H',\n        'Y' => 'R', 'Z' => 'C' }\nprint \"\nThe encoded message is: \"\n\"The secret message\".each_byte do | b |\n    b = b.chr.upcase\n    if key.has_key?(b) then\n        print key[b]\n    else\n        print b\n    end\nend\nprint \"\n\"\n\n# But give us the info to read it anyway.\nprint \"The key is: \"\nct = 8\nkey.each { | k, v | \n    if ct == 8 then \n        print \"\n   \"\n        ct = 0\n    else\n        print \", \"\n    end\n    ct = ct + 1\n    print \"#{v} => #{k}\"  \n}\nprint \"\n\n\"\n\n# Some interesting things from Integer.\n3.times { print \"Hi! \" }\nprint \"\n\"\n\nprint \"Count: \"\n3.upto(7) { |n| print n, \" \" }\nprint \"\n\"", lang: "Ruby 2.5"},
                        {label: "structs.go", type: "doc", id: '1_9', content: "package main\nimport \"fmt\"\n\ntype person struct {\n    name string\n    age  int\n}\nfunc main() {\n\n    fmt.Println(person{\"Bob\", 20})\n\n    fmt.Println(person{name: \"Alice\", age: 30})\n\n    fmt.Println(person{name: \"Fred\"})\n\n    fmt.Println(&person{name: \"Ann\", age: 40})\n\n    s := person{name: \"Sean\", age: 50}\n    fmt.Println(s.name)\n\n    sp := &s\n    fmt.Println(sp.age)\n\n    sp.age = 51\n    fmt.Println(sp.age)\n}", lang: 'Go 1.10'},
                        {label: "max.lua", type: "doc", id: '1_10', content: "function max(num1, num2)\n\n   if (num1 > num2) then\n      result = num1;\n   else\n      result = num2;\n   end\n\n   return result; \nend\n\n-- calling a function\nprint(\"The maximum of the two numbers is \",max(10,4))\nprint(\"The maximum of the two numbers is \",max(5,6))", lang: "Lua 5.3"},
                        {label: "url_parse.js", type: "doc", id: '1_11', content: "// include url module\nvar url = require('url');\nvar address = 'http://localhost:8080/index.php?type=page&action=update&id=5221';\nvar q = url.parse(address, true);\n \nconsole.log(q.host); //returns 'localhost:8080'\nconsole.log(q.pathname); //returns '/index.php'\nconsole.log(q.search); //returns '?type=page&action=update&id=5221'\n \nvar qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }\nconsole.log(qdata.type); //returns 'page'\nconsole.log(qdata.action); //returns 'update'\nconsole.log(qdata.id); //returns '5221'", lang: 'Node.js 10.5.0'},
                        {label: "hello.php", type: "doc", id: '1_12', content: "<?php\n  // Declare the variable 'string' and assign it a value.\n  // The <br> is the HTML equivalent to a new line.\n  $string = 'Hello World!<br>';\n\n  // You can echo the variable, similar to the way you would echo a string.\n  echo $string;\n\n  // You could also use print.\n  print $string;\n\n  // Or, if you are familiar with C, printf can be used too.\n  printf('%s', $string);\n?>", lang: 'PHP 7.2'},
                        {label: "f1.adb", type: "doc", id: '1_13', content: "--\n-- Trivial function.\n--\nwith Gnat.Io; use Gnat.Io;\nprocedure f1 is\n   -- A small function.\n   function Sumsqr(X, Y: Integer) return Integer is\n   begin\n      return X*X + Y*Y;\n   end;\n\n   -- How 'bout a nice, tender variable?\n   I: Integer;\nbegin\n   I := Sumsqr(3, 14);\n   Put(I);\n   New_Line;\n\n   Put(Sumsqr(I, 4));\n   New_Line;\nend f1;", lang: 'Ada'}
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
