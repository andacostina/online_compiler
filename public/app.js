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
.controller("mainController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.themes = ["twilight", "ambiance", "clouds", "cobalt", "dracula", "dreamweaver", "idle_fingers", "kuroir", "monokai", "terminal", "vibrant_ink", "xcode"];
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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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

    $scope.codeExamples = [
        "# Mode Python\n\nprint \"Hello, World!\"",
        "# Mode Python\n\nprint(\"Hello, World!\")", 
        "// Mode C\n\n#include <stdio.h>\nint main()\n{\n   printf(\"Hello, World!\");\n    return 0;\n};", 
        "// Mode C++\n\n#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", 
        "// Mode Java\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", 
        "// Mode C#\n\nnamespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n}"
    ];
    $scope.aceModel = $scope.codeExamples[0];
    $http({
        method: 'GET',
        url: '/code-examples'
    }).then(function success(response) {
        $scope.codeExamples = response.data.codeExamples;
        $scope.aceModel = $scope.codeExamples[0];
    }, function error(response) {
    });

    $scope.treedata = [
        {label: "My scripts", type: "folder", id: 0, children: [
            {label: "main.py", type: "doc", id: 1, content: $scope.aceModel}
        ]}
    ];
    $scope.expandedNodes = [$scope.treedata[0]];
    $scope.selectedNode = $scope.treedata[0].children[0];

    $scope.onSelection = function(sel) {
        $scope.selectedNode = sel;
        if ($scope.selectedNode.type === 'doc') {
            $scope.aceModel = $scope.selectedNode.content;
        };
    };

    $scope.createFolder = function() {
        if ($scope.selectedNode && $scope.selectedNode.type == 'folder') {
            var numChildren = $scope.selectedNode.children.length;
            $scope.selectedNode.children.push({label: 'New folder', type: 'folder', id: $scope.selectedNode.id + "_" + numChildren + 1, children: []});
        }
        else {
            $scope.treedata.push({label: 'New folder', type: 'folder', 'id': $scope.treedata.length + 1, children: []});
        };
    };

    $scope.createFile = function() {
        if ($scope.selectedNode && $scope.selectedNode.type == 'folder') {
            var numChildren = $scope.selectedNode.children.length;
            $scope.selectedNode.children.push({label: 'New file', type: 'doc', id: $scope.selectedNode.id + "_" + numChildren + 1, content: ''});
        }
        else {
            $scope.treedata.push({label: 'New file', type: 'doc', 'id': $scope.treedata.length + 1, content: ''});
        };
    };

    $scope.lastRightClickNode = null;
    $scope.onRightClick = function(node) {
        $scope.lastRightClickNode = node.label;
    };

    $scope.editorEnabled = false;

    $scope.isEditorEnabled = function(nodeId) {
        if (!$scope.selectedNode) {
            return false;
        };
        if ($scope.editorEnabled && nodeId === $scope.selectedNode.id) {
            return true;
        };
        return false;
    };

    $scope.rename = function() {
        if ($scope.selectedNode) {
            $scope.selected = $scope.selectedNode;
            $scope.editorEnabled = true;

            $scope.editableText = $scope.selected.label;
            $scope.disableEditor = function() {
                $scope.editorEnabled = false;
                $scope.editableText = '';
            };
            $scope.save = function(editableText) {
                $scope.selected.label = editableText;
                $scope.disableEditor();
            };

        };
    };

    $scope.myFile = null;
    $scope.uploadFile = function() {
        var file = $scope.myFile;
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
                if ($scope.selectedNode && $scope.selectedNode.type === 'folder') {
                    var numChildren = $scope.selectedNode.children.length;
                    $scope.selectedNode.children.push({label: name, type: 'doc', id: $scope.selectedNode.id + "_" + numChildren + 1, content: content});
                }
                else {
                    $scope.treedata.push({label: name, type: 'doc', 'id': $scope.treedata.length + 1, content: content});
                };
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
            removeNode($scope.selectedNode.id, $scope.treedata);
            $scope.aceModel = '';
        };
    };

    $scope.aceOption = {
        useWrapMode : false,
        showGutter: true,
        theme: $scope.themes[0],
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
                        'language': $scope.langModel
                    }
                }).then(function success(response) {
                    if (response.data.error) {
                        $scope.output = "Error when running code";
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
                var i = $scope.languages.indexOf($scope.langModel);
                $scope.aceModel = $scope.codeExamples[i];
            };

            $scope.themeChanged = function() {
                var theme = _editor.getTheme().split('/')[2];
                var i = $scope.themes.indexOf(theme);
                if (i === $scope.themes.length - 1) {
                    i = -1;
                };
                _editor.setTheme("ace/theme/" + $scope.themes[i + 1]);
            };

            $scope.zoomIn = function() {
                var size = _editor.getFontSize();
                _editor.setFontSize(size + 1);
            }

            $scope.zoomOut = function() {
                var size = _editor.getFontSize();
                _editor.setFontSize(size - 1);
            }

            $scope.changeAutoComplete = function() {
                $scope.autoComplete = !$scope.autoComplete;
                _editor.setOptions({
                    enableBasicAutocompletion: $scope.autoComplete,
                    enableLiveAutocompletion: $scope.autoComplete
                });
            }
        },
        onChange: function(_editor) {

        },
        require: ["ace/ext/language_tools"],
        advanced: {
            enableBasicAutocompletion: $scope.autoComplete,
            enableLiveAutocompletion: $scope.autoComplete
        }}
    ;
}]);
