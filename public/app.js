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
        switch(language) {
            case "C":
                return "c_cpp";
            case "C++":
                return "c_cpp"
            case "C#":
                return "csharp"
            case "Python2":
                return "python"
            case "Python3":
                return "python"
            case "Java":
                return "java"
            default:
                return language.toLowerCase();
        };
    };

    function getFileExtension(language) {
        switch(language) {
            case "C":
                return ".c";
            case "C++":
                return ".cpp"
            case "C#":
                return ".csc"
            case "Python2":
                return ".py"
            case "Python3":
                return ".py"
            case "Java":
                return ".java"
            default:
                return "";
        };
    };

    function getLanguageFromExtension(filename) {
        var extension = filename.split('.', 2)[1];
        switch(extension) {
            case "c":
                return "C"
            case "cpp":
                return "C++"
            case "csc":
                return "C#"
            case "py":
                return "Python2"
            case "java":
                return "Java"
            default:
                return ""
        };
    };

    $scope.languages = ["Python2", "Python3", "C", "C++", "Java", "C#"];
    $scope.langModel = $scope.languages[0];
    $http({
        method: 'GET',
        url: '/languages'
    }).then(function success(response) {
        $scope.languages = response.data.languages;
        $scope.langModel = $scope.languages[0];
    }, function error(response) {
    });

    $scope.treedata = [
        {label: "Scripts", type: "folder", id: '1', children: [
            {label: "helloworld_2.py", type: "doc", id: '1_1', content: "print \"Hello, World!\"", lang: "Python2"},
            {label: "helloworld_3.py", type: "doc", id: '1_2', content: "print(\"Hello, World!\")", lang: "Python3"},
            {label: "helloworld.c", type: "doc", id: '1_3', content: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n};", lang: "C"},
            {label: "helloworld.cpp", type: "doc", id: '1_4', content: "#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", lang: "C++"},
            {label: "HelloWorld.java", type: "doc", id: '1_5', content: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", lang: "Java"},
            {label: "Hello.csc", type: "doc", id: '1_6', content: "namespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}", lang: "C#"}
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
    
                $scope.modeChanged = function () {
                    _editor.getSession().setMode("ace/mode/" + getAceMode($scope.langModel));
                    var currentName = $scope.selectedFile.label;
                    var splits = currentName.split('.', 2);
                    $scope.selectedFile.label = splits[0] + getFileExtension($scope.langModel);
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
