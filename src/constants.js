'use strict';

module.exports = {
    languages: ["Python2", "Python3", "C", "C++", "Java", "C#"],
    codeExamples: [
        "# Mode Python2\n\nprint \"Hello, World!\"",
        "# Mode Python3\n\nprint(\"Hello, World!\")",
        "// Mode C\n\n#include <stdio.h>\nint main()\n{\n   printf(\"Hello, World!\");\n    return 0;\n};", 
        "// Mode C++\n\n#include <iostream>\nint main()\n{\n  std::cout << \"Hello, World!\";\n}", 
        "// Mode Java\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}", 
        "// Mode C#\n\nnamespace HelloWorld\n{\n    class Hello {\n        static void Main(string[] args)\n        {\n            System.Console.WriteLine(\"Hello, World!\");\n        }\n}"
    ]
}