angular.module("compilerApp", ["ui.ace", "ui.bootstrap"])
.controller("mainController", function($scope, $http, $timeout) {

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
});