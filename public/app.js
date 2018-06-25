angular.module("compilerApp", ["ui.ace", "ui.bootstrap", "treeControl"])
.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.controller("mainController", ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    $scope.designThemes = [
        {
            editor: 'twilight',
            color1: 'white',
            color2: '#222',
            color3: '#404040',
            color4: 'black'
        },
        {
            editor: 'github',
            color1: 'black',
            color2: '#f2f2f2',
            color3: '#d9d9d9',
            color4: 'white'
        }
    ];
    $scope.themeIndex = 0;

    $scope.autoComplete = true;
    $scope.output = "";
    $scope.running = false;

    function getAceMode(language) {
        if (language.startsWith('Python')) {
            return "python";
        };
        if (language.startsWith('C++')) {
            return "c_cpp";
        };
        if (language.startsWith('Java')) {
            return "java";
        };
        if (language.startsWith('C#')) {
            return "csharp";
        };
        if (language.startsWith('Node.js')) {
            return "javascript";
        };
        switch(language) {
            case "C 90":
                return "c_cpp";
            case "C 95":
                return "c_cpp";
            case "C 99":
                return "c_cpp";
            case "C 11":
                return "c_cpp";
            case "C GNU 90":
                return "c_cpp";
            case "C GNU 99":
                return "c_cpp";
            case "C GNU 11":
                return "c_cpp";
            case "Perl 5.26":
                return "perl"
            case "Ruby 2.5":
                return "ruby"
            case "Go 1.10":
                return "go"
            case "Lua 5.3":
                return "lua"
            default:
                return language.toLowerCase();
        };
    };

    function getFileExtension(language) {
        if (language.startsWith('Python')) {
            return ".py";
        };
        if (language.startsWith('C++')) {
            return ".cpp";
        };
        if (language.startsWith('Java')) {
            return ".java";
        };
        if (language.startsWith('C#')) {
            return ".csc";
        };
        if (language.startsWith('Node.js')) {
            return ".js";
        };
        switch(language) {
            case "C 90":
                return ".c";
            case "C 95":
                return ".c";
            case "C 99":
                return ".c";
            case "C 11":
                return ".c";
            case "C GNU 90":
                return ".c";
            case "C GNU 99":
                return ".c";
            case "C GNU 11":
                return ".c";
            case "Perl 5.26":
                return ".pl";
            case "Ruby 2.5":
                return ".rb"
            case "Go 1.10":
                return ".go"
            case "Lua 5.3":
                return ".lua"
            default:
                return "";
        };
    };

    function getLanguageFromExtension(filename) {
        var extension = filename.split('.', 2)[1];
        switch(extension) {
            case "c":
                return "C GNU 11"
            case "cpp":
                return "C++ GNU 14"
            case "csc":
                return "C# 7.0"
            case "py":
                return "Python 2.7"
            case "java":
                return "Java 8"
            case "pl":
                return "Perl 5.26"
            case "rb":
                return "Ruby 2.5"
            case "go":
                return "Go 1.10"
            case "lua":
                return "Lua 5.3"
            case "js":
                return "Node.js 10.5.0"
            default:
                return ""
        };
    };

    $scope.languages = [
        "Python 2.4", "Python 2.5", "Python 2.6", "Python 2.7", "Python 3.1", "Python 3.2",
        "Python 3.3", "Python 3.4", "Python 3.5", "Python 3.6", "C 90", "C 95", "C 99", "C 11",
        "C GNU 90", "C GNU 99", "C GNU 11", "C++ 98", "C++ 03", "C++ 11", "C++ 14", "C++ 17",
        "C++ GNU 98", "C++ GNU 03", "C++ GNU 11", "C++ GNU 14", "C++ GNU 17", "Java 8", "Java 10", 
        "C# 1.0", "C# 2.0", "C# 3.0", "C# 4.0", "C# 5.0", "C# 6.0", "C# 7.0", "Perl 5.26", "Ruby 2.5", "Go 1.10",
        "Lua 5.3", "Node.js 10.5.0", "Node.js 9.11.2", "Node.js 7.10.1", "Node.js 6.14.3",
        "Node.js 5.12.0", "Node.js 4.9.1", "Node.js 0.12.18", "Node.js 0.10.48"
    ];
    $scope.langModel = $scope.languages[0];
    $http({
        method: 'GET',
        url: '/languages'
    }).then(function success(response) {
        $scope.languages = response.data.languages;
        $scope.langModel = $scope.languages[0];
    }, function error(response) {
    });

    $http({
        method: 'GET',
        url: '/documentation'
    }).then(function success(response) {
        $scope.documentationLinks = response.data.documentation_links;
    }, function error(response) {
    });

    $scope.treedata = [
        {label: "Scripts", type: "folder", id: '1', children: [
            {label: "helloworld_2.py", type: "doc", id: '1_1', content: "print \"Hello, World!\"", lang: "Python 2.7"},
            {label: "helloworld_3.py", type: "doc", id: '1_2', content: "print(\"Hello, World!\")", lang: "Python 3.6"},
            {label: "helloworld.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n};", lang: "C GNU 11"},
            {label: "helloworld.cpp", type: "doc", id: '1_4', content: "#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", lang: "C++ GNU 14"},
            {label: "HelloWorld.java", type: "doc", id: '1_5', content: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", lang: "Java 8"},
            {label: "Hello.csc", type: "doc", id: '1_6', content: "namespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}", lang: "C# 7.0"},
            {label: "while.pl", type: "doc", id: '1_7', content: "use strict;\n\nmy $a = 5;\nwhile($a > 0) {\n    print \"$a \";\n    $a--;\n}\nprint \"\n\";", lang: "Perl 5.26"},
            {label: "iter.rb", type: "doc", id: '1_8', content: "# Here's a different way to add up an array.\nfred = [ 4, 19, 3, 7, 32 ]\nsum = 0\nfred.each { |i| sum += i }\nprint \"Sum of [\", fred.join(\" \"), \"] is #{sum}\n\"\n\n# Or create a secret message.\nkey = { 'A' => 'U', 'B' => 'Q', 'C' => 'A', 'D' => 'F', 'E' => 'D', 'F' => 'K',\n        'G' => 'P', 'H' => 'W', 'I' => 'N', 'J' => 'L', 'K' => 'J', 'L' => 'M',\n        'M' => 'S', 'N' => 'V', 'O' => 'Y', 'P' => 'O', 'Q' => 'Z', 'R' => 'T',\n        'S' => 'E', 'T' => 'I', 'U' => 'X', 'V' => 'B', 'W' => 'G', 'X' => 'H',\n        'Y' => 'R', 'Z' => 'C' }\nprint \"\nThe encoded message is: \"\n\"The secret message\".each_byte do | b |\n    b = b.chr.upcase\n    if key.has_key?(b) then\n        print key[b]\n    else\n        print b\n    end\nend\nprint \"\n\"\n\n# But give us the info to read it anyway.\nprint \"The key is: \"\nct = 8\nkey.each { | k, v | \n    if ct == 8 then \n        print \"\n   \"\n        ct = 0\n    else\n        print \", \"\n    end\n    ct = ct + 1\n    print \"#{v} => #{k}\"  \n}\nprint \"\n\n\"\n\n# Some interesting things from Integer.\n3.times { print \"Hi! \" }\nprint \"\n\"\n\nprint \"Count: \"\n3.upto(7) { |n| print n, \" \" }\nprint \"\n\"", lang: "Ruby 2.5"},
            {label: "structs.go", type: "doc", id: '1_9', content: "package main\nimport \"fmt\"\n\ntype person struct {\n    name string\n    age  int\n}\nfunc main() {\n\n    fmt.Println(person{\"Bob\", 20})\n\n    fmt.Println(person{name: \"Alice\", age: 30})\n\n    fmt.Println(person{name: \"Fred\"})\n\n    fmt.Println(&person{name: \"Ann\", age: 40})\n\n    s := person{name: \"Sean\", age: 50}\n    fmt.Println(s.name)\n\n    sp := &s\n    fmt.Println(sp.age)\n\n    sp.age = 51\n    fmt.Println(sp.age)\n}", lang: 'Go 1.10'},
            {label: "max.lua", type: "doc", id: '1_10', content: "function max(num1, num2)\n\n   if (num1 > num2) then\n      result = num1;\n   else\n      result = num2;\n   end\n\n   return result; \nend\n\n-- calling a function\nprint(\"The maximum of the two numbers is \",max(10,4))\nprint(\"The maximum of the two numbers is \",max(5,6))", lang: "Lua 5.3"},
            {label: "url_parse.js", type: "doc", id: '1_11', content: "// include url module\nvar url = require('url');\nvar address = 'http://localhost:8080/index.php?type=page&action=update&id=5221';\nvar q = url.parse(address, true);\n \nconsole.log(q.host); //returns 'localhost:8080'\nconsole.log(q.pathname); //returns '/index.php'\nconsole.log(q.search); //returns '?type=page&action=update&id=5221'\n \nvar qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }\nconsole.log(qdata.type); //returns 'page'\nconsole.log(qdata.action); //returns 'update'\nconsole.log(qdata.id); //returns '5221'", lang: 'Node.js 10.5.0'}
        ]}
    ];
    $scope.memory = 0;
    $scope.memoryLimit = 10 ** 9;
    $scope.aceModel = $scope.treedata[0].children[0].content;

    $scope.expandedNodes = [$scope.treedata[0]];
    $scope.selectedNode = $scope.treedata[0].children[0];
    $scope.selectedFile = $scope.selectedNode;

    $http({
        method: 'GET',
        url: '/memory_limit'
    }).then(function success(response) {
        $scope.memoryLimit = response.data.memoryLimit;
    }, function error(response) {
    });

    var memoryTemp = 0;
    function computeMemory(data) {
        for (var i = 0; i < data.length; i++) {
            var elem = data[i];
            if (elem.type === 'doc') {
                memoryTemp += elem.content.length;
            }
            else if (elem.type === 'folder') {
                computeMemory(elem.children);
            };
        };
    };
    $interval(function() {
        computeMemory($scope.treedata);
        $scope.memory = memoryTemp;
        memoryTemp = 0;
    }, 10000);
    
    $http({
        method: 'GET',
        url: '/tree'
    }).then(function success(response) {
        $scope.treedata = response.data;
        $scope.aceModel = $scope.treedata[0].children[0].content;

        $scope.aceOption = {
            useWrapMode : false,
            showGutter: true,
            theme: $scope.designThemes[$scope.themeIndex].editor,
            mode: getAceMode($scope.languages[0]),
            firstLineNumber: 1,
            onLoad: function(_editor) {
                _editor.setShowPrintMargin(false);
                _editor.setAutoScrollEditorIntoView(true);
    
                $scope.runCode = function() {
                    $scope.running = true;
                    $http({
                        method: 'POST',
                        url: '/compile',
                        data: {
                            'code': $scope.aceModel,
                            'filename': $scope.selectedFile.label,
                            'language': $scope.selectedFile.lang
                        }
                    }).then(function success(response) {
                        if (response.data.error) {
                            $scope.output = response.data.error;
                        }
                        else {
                            $scope.output = response.data.stdout;
                            if (response.data.stderr) {
                                $scope.output += "\n" + response.data.stderr;
                            };
                        };
                        $scope.running = false;
                    }, function error(response) {
                        $scope.output = "Error running\n" + response.data.message;
                        $scope.running = false;
                    });
                };

                angular.element(document).bind('keyup', function (e) {
                    if (e.keyCode === 115) {
                        $scope.runCode();
                    };
                });
    
                $scope.modeChanged = function () {
                    _editor.getSession().setMode("ace/mode/" + getAceMode($scope.langModel));
                    var currentName = $scope.selectedFile.label;
                    var pointPos = currentName.lastIndexOf('.');
                    $scope.selectedFile.label = currentName.substring(0, pointPos) + getFileExtension($scope.langModel);
                    $scope.selectedFile.lang = $scope.langModel;
                };
    
                $scope.themeChanged = function() {
                    $scope.themeIndex = 1 - $scope.themeIndex;
                    _editor.setTheme("ace/theme/" + $scope.designThemes[$scope.themeIndex].editor);
                };
    
                $scope.zoomIn = function() {
                    var size = _editor.getFontSize();
                    _editor.setFontSize(size + 1);
                };
    
                $scope.zoomOut = function() {
                    var size = _editor.getFontSize();
                    _editor.setFontSize(size - 1);
                };
    
                $scope.changeAutoComplete = function() {
                    $scope.autoComplete = !$scope.autoComplete;
                    _editor.setOptions({
                        enableBasicAutocompletion: $scope.autoComplete,
                        enableLiveAutocompletion: $scope.autoComplete
                    });
                };

                $scope.getDocumentationLink = function() {
                    var index = $scope.languages.indexOf($scope.langModel);
                    window.open($scope.documentationLinks[index], '_blank');
                };

                $scope.lastRefreshed = new Date();
                $interval(function() {
                    $http({
                        method: 'POST',
                        url: '/refresh',
                        data: {tree: $scope.treedata}
                    }).then(function success(response) {
                        $scope.lastRefreshed = new Date();
                    }, function error(response) {
                    });
                }, 1000 * 10);
            },
            onChange: function(_editor) {
                $scope.selectedFile.content = $scope.aceModel;
            },
            require: ["ace/ext/language_tools"],
            advanced: {
                enableBasicAutocompletion: $scope.autoComplete,
                enableLiveAutocompletion: $scope.autoComplete
            }
        };

        $scope.expandedNodes = [$scope.treedata[0]];
        $scope.selectedNode = $scope.treedata[0].children[0];
        $scope.selectedFile = $scope.selectedNode;

        $scope.createFolder = function() {
            if ($scope.selectedNode && $scope.selectedNode.type == 'folder') {
                var children = $scope.selectedNode.children;
                var lastChildId = 0;
                if (children.length > 0) {
                    var ids = children[children.length - 1].id.split('_');
                    lastChildId = Number(ids[ids.length - 1]);
                };
                $scope.selectedNode.children.push({label: 'New folder', type: 'folder', id: $scope.selectedNode.id + "_" + (lastChildId + 1), children: []});
            }
            else {
                var lastId = 0;
                if ($scope.treedata.length > 0) {
                    lastId = Number($scope.treedata[$scope.treedata.length - 1].id);
                };
                $scope.treedata.push({label: 'New folder', type: 'folder', 'id': (lastId + 1).toString(), children: []});
            };
        };
    
        $scope.createFile = function() {
            if ($scope.selectedNode && $scope.selectedNode.type == 'folder') {
                var children = $scope.selectedNode.children;
                var lastChildId = 0;
                if (children.length > 0) {
                    var ids = children[children.length - 1].id.split('_');
                    lastChildId = Number(ids[ids.length - 1]);
                };
                $scope.selectedNode.children.push({label: 'New file', type: 'doc', id: $scope.selectedNode.id + "_" + (lastChildId + 1), content: '', lang: '?'});
            }
            else {
                var lastId = 0;
                if ($scope.treedata.length > 0) {
                    lastId = Number($scope.treedata[$scope.treedata.length - 1].id);
                };
                $scope.treedata.push({label: 'New file', type: 'doc', 'id': (lastId + 1).toString(), content: '', lang: '?'});
            };
        };

        $scope.lastRightClickNode = null;
        $scope.onRightClick = function(node) {
            $scope.lastRightClickNode = node.label;
        };

        $scope.editorEnabled = false;

        $scope.isEditorEnabled = function(nodeId) {
            if ($scope.editorEnabled && nodeId === $scope.selectedNode.id) {
                return true;
            };
            return false;
        };

        $scope.rename = function() {
            if ($scope.selectedNode) {
                $scope.editorEnabled = true;

                $scope.editableText = $scope.selectedFile.label;
                $scope.disableEditor = function() {
                    $scope.editorEnabled = false;
                    $scope.editableText = '';
                };
                $scope.save = function(editableText) {
                    $scope.selectedFile.label = editableText;
                    $scope.selectedFile.lang = getLanguageFromExtension(editableText);
                    $scope.disableEditor();
                };
            };
        };

        $scope.myFile = null;
        $scope.uploadFile = function() {
            var file = $scope.myFile;
            if ($scope.memory + file.size > $scope.memoryLimit) {
                alert('You cannot upload any more files. The size limit has been exceeded.');
                return;
            };
            var fd = new FormData();
            fd.append('file', file);
            $http({
                method: 'POST',
                url: '/upload',
                data: fd,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function success(response) {
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    var name = response.data.name;
                    var content = response.data.content;
                    var language = getLanguageFromExtension(name);
                    if ($scope.selectedNode && $scope.selectedNode.type === 'folder') {
                        var numChildren = $scope.selectedNode.children.length;
                        $scope.selectedNode.children.push({label: name, type: 'doc', id: $scope.selectedNode.id + "_" + numChildren + 1, content: content, lang: language});
                    }
                    else {
                        $scope.treedata.push({label: name, type: 'doc', 'id': $scope.treedata.length + 1, content: content, lang: language});
                    };
                    $scope.memory += content.length;
                };
            }, function error(response) {
                alert(response);
            });
        };

        $scope.$watch("myFile", function() {
            if ($scope.myFile) $scope.uploadFile();
        });

        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, fileName) {
                    blob = new Blob([data]),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());
        $scope.downloadFile = function() {
            if ($scope.selectedNode && $scope.selectedNode.type === 'doc') {
                saveData($scope.selectedNode.content, $scope.selectedNode.label);
            };
        };
    
        var removeNode = function(id, tree) {
            for (var i = 0; i < tree.length; i++) {
                elem = tree[i];
                if (elem.id === id) {
                    tree.splice(i, 1);
                    return;
                };
                if (elem.children && elem.children.length > 0) {
                    removeNode(id, elem.children);
                };
            };
        };
        $scope.remove = function() {
            if ($scope.selectedNode) {
                $scope.memory -= $scope.selectedNode.content.length;
                removeNode($scope.selectedNode.id, $scope.treedata);
                $scope.aceModel = '';
                $scope.selectedNode = null;
            };
        };

        $scope.onSelection = function(sel) {
            $scope.selectedNode = sel;
            if ($scope.selectedNode.type === 'doc') {
                $scope.aceModel = $scope.selectedNode.content;
                $scope.langModel = $scope.selectedNode.lang;
                $scope.selectedFile = $scope.selectedNode;
            };
        };

        $scope.runDisabled = function() {
            if ($scope.languages.indexOf($scope.langModel) > -1) {
                return false;
            };
            return true;
        };
    }, function error(response) {
    });
    
    
}]);
