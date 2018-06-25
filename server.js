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
                        {label: "8queens.py", type: "doc", id: '1_1', content: "BOARD_SIZE = 8\n\ndef under_attack(col, queens):\n    left = right = col\n\n    for r, c in reversed(queens):\n        left, right = left - 1, right + 1\n\n        if c in (left, col, right):\n            return True\n    return False\n\ndef solve(n):\n    if n == 0:\n        return [[]]\n\n    smaller_solutions = solve(n - 1)\n\n    return [solution+[(n,i+1)]\n        for i in xrange(BOARD_SIZE)\n            for solution in smaller_solutions\n                if not under_attack(i+1, solution)]\nfor answer in solve(BOARD_SIZE):\n    print answer", lang: 'Python 2.7'},
                        {label: "random_sentences.py", type: "doc", id: '1_2', content: "\"\"\"Generates Random Sentences\nCreates a sentence by selecting a word at randowm from each of the lists in\n    the following order: 'article', 'nounce', 'verb', 'preposition',\n    'article' and 'noun'.\n    The second part produce a short story consisting of several of\n    these sentences -- Random Note Writer!!\n\"\"\"\n\nimport random\n\narticle = [\"the\", \"a\", \"one\", \"some\", \"any\"]\nnoun = [\"boy\", \"girl\", \"dog\", \"town\", \"car\"]\nverb = [\"drove\", \"jumped\", \"ran\", \"walked\", \"skipped\"]\npreposition = [\"to\", \"from\", \"over\", \"under\", \"on\"]\n\ndef random_int():\n  return random.randint(0,4)\n\ndef random_sentence():\n    \"\"\"Creates random and return sentences.\"\"\"\n    return (\"{} {} {} {} {} {}\"\n                .format(article[random_int()]\n                        ,noun[random_int()]\n                        ,verb[random_int()]\n                        ,preposition[random_int()]\n                        , article[random_int()]\n                        ,noun[random_int()])).capitalize()\n    \n# prints random sentences\nfor sentence in list(map(lambda x: random_sentence(), range(0, 20))):\n  print(sentence)\n  \nprint(\"\\n\")\n\nstory = (\". \").join(list(map(lambda x: random_sentence(), range(0, 20))))\n\n# prints random sentences story\nprint(\"{}\".format(story))", lang: "Python 3.6"},
                        {label: "pyramid.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    int i, space, rows=6, k=0, count = 0, count1 = 0;\n\n    for(i=1; i<=rows; ++i)\n    {\n        for(space=1; space <= rows-i; ++space)\n        {\n            printf(\"  \");\n            ++count;\n        }\n\n        while(k != 2*i-1)\n        {\n            if (count <= rows-1)\n            {\n                printf(\"%d \", i+k);\n                ++count;\n            }\n            else\n            {\n                ++count1;\n                printf(\"%d \", (i+k-2*count1));\n            }\n            ++k;\n        }\n        count1 = count = k = 0;\n\n        printf(\"\\n\");\n    }\n    return 0;\n}", lang: "C GNU 11"},
                        {label: "factorial.cpp", type: "doc", id: '1_4', content: "#include<iostream>\nusing namespace std;\n\nint factorial(int n);\n\nint main()\n{\n    int n = 23;\n\n    cout << \"Factorial of \" << n << \" = \" << factorial(n);\n\n    return 0;\n}\n\nint factorial(int n)\n{\n    if(n > 1)\n        return n * factorial(n - 1);\n    else\n        return 1;\n}", lang: "C++ GNU 14"},
                        {label: "TreeSetExample.java", type: "doc", id: '1_5', content: "import java.util.TreeSet;\npublic class TreeSetExample {\n     public static void main(String args[]) {\n         // TreeSet of String Type\n         TreeSet<String> tset = new TreeSet<String>();\n\n         // Adding elements to TreeSet<String>\n         tset.add(\"ABC\");\n         tset.add(\"String\");\n         tset.add(\"Test\");\n         tset.add(\"Pen\");\n         tset.add(\"Ink\");\n         tset.add(\"Jack\");\n\n         //Displaying TreeSet\n         System.out.println(tset);\n\n         // TreeSet of Integer Type\n         TreeSet<Integer> tset2 = new TreeSet<Integer>();\n\n         // Adding elements to TreeSet<Integer>\n         tset2.add(88);\n         tset2.add(7);\n         tset2.add(101);\n         tset2.add(0);\n         tset2.add(3);\n         tset2.add(222);\n         System.out.println(tset2);\n    }\n }", lang: "Java 8"},
                        {label: "Program.csc", type: "doc", id: '1_6', content: "using System;\n \nnamespace Add_Diagonal\n{\n    public class Program\n    {\n        public static void Main(string[] args)\n        {\n            int[,] num= {\n                {22,50,11, 2, 49},\n                {92,63,12,64,37},\n                {75,23,64,12,99},\n                {21,25,71,69,39},\n                {19,39,58,28,83}};\n \n                //Getting Row and Column Length\n                int rowlength = num.GetLength(0);\n                int columnlength = num.GetLength(1);\n                int total=0;\n                Console.Write(\"Diagonals are : \");\n                for(int row=0; row<rowlength; row++)\n                {\n                    for(int column=0; column<columnlength; column++)\n                    {\n                        if(row==column)\n                        {\n                            Console.Write(num[row,column] + \" \");\n                            total += num[row,column];\n                        }\n                    }\n                }\n                Console.WriteLine(\": Sum : \" + total);\n        }\n    }\n}", lang: "C# 7.0"},
                        {label: "while.pl", type: "doc", id: '1_7', content: "use strict;\n\nmy $a = 5;\nwhile($a > 0) {\n    print \"$a \";\n    $a--;\n}\nprint \"\n\";", lang: "Perl 5.26"},
                        {label: "iter.rb", type: "doc", id: '1_8', content: "# Here's a different way to add up an array.\nfred = [ 4, 19, 3, 7, 32 ]\nsum = 0\nfred.each { |i| sum += i }\nprint \"Sum of [\", fred.join(\" \"), \"] is #{sum}\n\"\n\n# Or create a secret message.\nkey = { 'A' => 'U', 'B' => 'Q', 'C' => 'A', 'D' => 'F', 'E' => 'D', 'F' => 'K',\n        'G' => 'P', 'H' => 'W', 'I' => 'N', 'J' => 'L', 'K' => 'J', 'L' => 'M',\n        'M' => 'S', 'N' => 'V', 'O' => 'Y', 'P' => 'O', 'Q' => 'Z', 'R' => 'T',\n        'S' => 'E', 'T' => 'I', 'U' => 'X', 'V' => 'B', 'W' => 'G', 'X' => 'H',\n        'Y' => 'R', 'Z' => 'C' }\nprint \"\nThe encoded message is: \"\n\"The secret message\".each_byte do | b |\n    b = b.chr.upcase\n    if key.has_key?(b) then\n        print key[b]\n    else\n        print b\n    end\nend\nprint \"\n\"\n\n# But give us the info to read it anyway.\nprint \"The key is: \"\nct = 8\nkey.each { | k, v | \n    if ct == 8 then \n        print \"\n   \"\n        ct = 0\n    else\n        print \", \"\n    end\n    ct = ct + 1\n    print \"#{v} => #{k}\"  \n}\nprint \"\n\n\"\n\n# Some interesting things from Integer.\n3.times { print \"Hi! \" }\nprint \"\n\"\n\nprint \"Count: \"\n3.upto(7) { |n| print n, \" \" }\nprint \"\n\"", lang: "Ruby 2.5"},
                        {label: "structs.go", type: "doc", id: '1_9', content: "package main\nimport \"fmt\"\n\ntype person struct {\n    name string\n    age  int\n}\nfunc main() {\n\n    fmt.Println(person{\"Bob\", 20})\n\n    fmt.Println(person{name: \"Alice\", age: 30})\n\n    fmt.Println(person{name: \"Fred\"})\n\n    fmt.Println(&person{name: \"Ann\", age: 40})\n\n    s := person{name: \"Sean\", age: 50}\n    fmt.Println(s.name)\n\n    sp := &s\n    fmt.Println(sp.age)\n\n    sp.age = 51\n    fmt.Println(sp.age)\n}", lang: 'Go 1.10'},
                        {label: "max.lua", type: "doc", id: '1_10', content: "function max(num1, num2)\n\n   if (num1 > num2) then\n      result = num1;\n   else\n      result = num2;\n   end\n\n   return result; \nend\n\n-- calling a function\nprint(\"The maximum of the two numbers is \",max(10,4))\nprint(\"The maximum of the two numbers is \",max(5,6))", lang: "Lua 5.3"},
                        {label: "url_parse.js", type: "doc", id: '1_11', content: "// include url module\nvar url = require('url');\nvar address = 'http://localhost:8080/index.php?type=page&action=update&id=5221';\nvar q = url.parse(address, true);\n \nconsole.log(q.host); //returns 'localhost:8080'\nconsole.log(q.pathname); //returns '/index.php'\nconsole.log(q.search); //returns '?type=page&action=update&id=5221'\n \nvar qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }\nconsole.log(qdata.type); //returns 'page'\nconsole.log(qdata.action); //returns 'update'\nconsole.log(qdata.id); //returns '5221'", lang: 'Node.js 10.5.0'},
                        {label: "hello.php", type: "doc", id: '1_12', content: "<?php\n  // Declare the variable 'string' and assign it a value.\n  // The <br> is the HTML equivalent to a new line.\n  $string = 'Hello World!<br>';\n\n  // You can echo the variable, similar to the way you would echo a string.\n  echo $string;\n\n  // You could also use print.\n  print $string;\n\n  // Or, if you are familiar with C, printf can be used too.\n  printf('%s', $string);\n?>", lang: 'PHP 7.2'},
                        {label: "f1.adb", type: "doc", id: '1_13', content: "--\n-- Trivial function.\n--\nwith Gnat.Io; use Gnat.Io;\nprocedure f1 is\n   -- A small function.\n   function Sumsqr(X, Y: Integer) return Integer is\n   begin\n      return X*X + Y*Y;\n   end;\n\n   -- How 'bout a nice, tender variable?\n   I: Integer;\nbegin\n   I := Sumsqr(3, 14);\n   Put(I);\n   New_Line;\n\n   Put(Sumsqr(I, 4));\n   New_Line;\nend f1;", lang: 'Ada'},
                        {label: "structures.lisp", type: "doc", id: '1_14', content: "(defstruct book \n   title \n   author \n   subject \n   book-id \n)\n\n( setq book1 (make-book :title \"C Programming\"\n   :author \"Nuha Ali\" \n   :subject \"C-Programming Tutorial\"\n   :book-id \"478\")\n)\n\n( setq book2 (make-book :title \"Telecom Billing\"\n   :author \"Zara Ali\" \n   :subject \"C-Programming Tutorial\"\n   :book-id \"501\")\n) \n\n(write book1)\n(terpri)\n(write book2)\n(setq book3( copy-book book1))\n(setf (book-book-id book3) 100) \n(terpri)\n(write book3)", lang: 'Common Lisp'}
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
