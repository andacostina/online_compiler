'use strict';

module.exports = {
    languages: ["Python2.7", "Python3.6", "C", "C++", "Java", "C#"],
    codeExamples: [
        "# Mode Python2.7\n\nprint \"Hello, World!\"",
        "# Mode Python3.6\n\nprint(\"Hello, World!\")",
        "// Mode C\n\n#include <stdio.h>\nint main()\n{\n   printf(\"Hello, World!\");\n    return 0;\n};", 
        "// Mode C++\n\n#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", 
        "// Mode Java\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", 
        "// Mode C#\n\nnamespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}}"
    ],
    documentationLinks: [
        "https://docs.python.org/2.7/",
        "https://docs.python.org/3.6/",
        "http://devdocs.io/c/",
        "https://en.cppreference.com/w/cpp/header",
        "https://docs.oracle.com/javase/specs/jls/se10/html/index.html",
        "https://docs.microsoft.com/en-us/dotnet/csharp/"
    ],
    extensions: ["py", "py", "c", "cpp", "java", "cs"],
    commands: ["python *", "python3 *", "gcc * ; ./a.out", "g++ * ; ./a.out", "javac * ; java **", "mcs * ; mono **.exe"],
    images: ["python2.7-image", "python3.6-image", "c-image", "cpp-image", "java-image", "csharp-image"],
    timeout: 60,
    memoryLimit: 10 ** 9,
    mongoHost: "mongodb://localhost:27017/sessions",
    databaseName: "sessions",
    collectionName: "data"
}
