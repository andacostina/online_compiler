'use strict';

module.exports = {
    languages: ["Python2.4", "Python2.5", "Python2.6", "Python2.7", "Python2.8", "Python2.9", "Python3.0",
                "Python3.1", "Python3.2", "Python3.3", "Python3.4", "Python3.5", "Python3.6", "C", "C++", "Java", "C#"
    ],
    codeExamples: [
        "# Mode Python2.4\n\nprint \"Hello, World!\"",
        "# Mode Python2.5\n\nprint \"Hello, World!\"",
        "# Mode Python2.6\n\nprint \"Hello, World!\"",
        "# Mode Python2.7\n\nprint \"Hello, World!\"",
        "# Mode Python2.8\n\nprint \"Hello, World!\"",
        "# Mode Python2.9\n\nprint \"Hello, World!\"",
        "# Mode Python3.0\n\nprint(\"Hello, World!\")",
        "# Mode Python3.1\n\nprint(\"Hello, World!\")",
        "# Mode Python3.2\n\nprint(\"Hello, World!\")",
        "# Mode Python3.3\n\nprint(\"Hello, World!\")",
        "# Mode Python3.4\n\nprint(\"Hello, World!\")",
        "# Mode Python3.5\n\nprint(\"Hello, World!\")",
        "# Mode Python3.6\n\nprint(\"Hello, World!\")",
        "// Mode C\n\n#include <stdio.h>\nint main()\n{\n   printf(\"Hello, World!\");\n    return 0;\n};", 
        "// Mode C++\n\n#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", 
        "// Mode Java\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", 
        "// Mode C#\n\nnamespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n    }\n}}"
    ],
    documentationLinks: [
        "https://docs.python.org/2.4/",
        "https://docs.python.org/2.5/",
        "https://docs.python.org/2.6/",
        "https://docs.python.org/2.7/",
        "https://docs.python.org/2.8/",
        "https://docs.python.org/2.9/",
        "https://docs.python.org/3.0/",
        "https://docs.python.org/3.1/",
        "https://docs.python.org/3.2/",
        "https://docs.python.org/3.3/",
        "https://docs.python.org/3.4/",
        "https://docs.python.org/3.5/",
        "https://docs.python.org/3.6/",
        "http://devdocs.io/c/",
        "https://en.cppreference.com/w/cpp/header",
        "https://docs.oracle.com/javase/specs/jls/se10/html/index.html",
        "https://docs.microsoft.com/en-us/dotnet/csharp/"
    ],
    extensions: ["py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "c", "cpp", "java", "cs"],
    commands: ["python2.4 *", "python2.5 *", "python2.6 *", "python2.7 *", "python2.8 *", "python2.9 *", 
              "python3.0 *", "python3.1 *", "python3.2 *", "python3.3 *", "python3.4 *", "python3.5 *", "python3 *", 
              "gcc * ; ./a.out", "g++ * ; ./a.out", "javac * ; java **", "mcs * ; mono **.exe"],
    images: ["python2.4-image", "python2.5-image", "python2.6-image", "python2.7-image", "python2.8-image", "python2.9-image",
            "python3.0-image", "python3.1-image", "python3.2-image", "python3.3-image", "python3.4-image", "python3.5-image", 
            "python3.6-image", "c-image", "cpp-image", "java-image", "csharp-image"
    ],
    timeout: 60,
    memoryLimit: 10 ** 9,
    mongoHost: "mongodb://localhost:27017/sessions",
    databaseName: "sessions",
    collectionName: "data"
}
