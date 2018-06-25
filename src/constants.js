'use strict';

module.exports = {
    languages: ["Python 2.4", "Python 2.5", "Python 2.6", "Python 2.7", "Python 3.1", "Python 3.2",
                "Python 3.3", "Python 3.4", "Python 3.5", "Python 3.6", "C 90", "C 95", "C 99", "C 11",
                "C GNU 90", "C GNU 99", "C GNU 11", "C++ 98", "C++ 03", "C++ 11", "C++ 14", "C++ 17",
                "C++ GNU 98", "C++ GNU 03", "C++ GNU 11", "C++ GNU 14", "C++ GNU 17", "Java 8", "Java 10", 
                "C# 1.0", "C# 2.0", "C# 3.0", "C# 4.0", "C# 5.0", "C# 6.0", "C# 7.0", "Perl 5.26", "Ruby 2.5", 
                "Go 1.10", "Lua 5.3", "Node.js 10.5.0", "Node.js 9.11.2", "Node.js 7.10.1", "Node.js 6.14.3",
                "Node.js 5.12.0", "Node.js 4.9.1", "Node.js 0.12.18", "Node.js 0.10.48", "PHP 7.2", "Ada"
    ],
    documentationLinks: [
        "https://docs.python.org/2.4/",
        "https://docs.python.org/2.5/",
        "https://docs.python.org/2.6/",
        "https://docs.python.org/2.7/",
        "https://docs.python.org/3.1/",
        "https://docs.python.org/3.2/",
        "https://docs.python.org/3.3/",
        "https://docs.python.org/3.4/",
        "https://docs.python.org/3.5/",
        "https://docs.python.org/3.6/",
        "http://devdocs.io/c/",
        "http://devdocs.io/c/",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",
        "http://devdocs.io/c/",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",
        "http://www.cplusplus.com/doc/oldtutorial/",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://en.cppreference.com/w/cpp/header",
        "https://docs.oracle.com/javase/specs/jls/se8/html/index.html",
        "https://docs.oracle.com/javase/specs/jls/se10/html/index.html",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://docs.microsoft.com/en-us/dotnet/csharp/",
        "https://perldoc.perl.org/",
        "https://ruby-doc.org/stdlib-2.5.1/",
        "https://golang.org/ref/spec",
        "https://www.lua.org/docs.html",
        "https://nodejs.org/api/",
        "https://nodejs.org/docs/latest-v9.x/api/",
        "https://nodejs.org/docs/latest-v7.x/api/",
        "https://nodejs.org/docs/latest-v6.x/api/",
        "https://nodejs.org/docs/latest-v5.x/api/",
        "https://nodejs.org/docs/latest-v4.x/api/",
        "https://nodejs.org/docs/latest-v0.12.x/api/",
        "https://nodejs.org/docs/latest-v0.10.x/api/",
        "http://php.net/manual/en/langref.php",
        "http://www.adaic.org/resources/add_content/standards/05rm/RM-Final.pdf"
    ],
    extensions: ["py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "c", "c", "c", "c", "c",
                 "c", "c", "cpp", "cpp", "cpp", "cpp", "cpp", "cpp", "cpp", "cpp", "cpp", "cpp", "java", "java", 
                 "cs", "cs", "cs", "cs", "cs", "cs", "cs", "pl", "rb", "go", "lua", "js", "js", "js", "js",
                 "js", "js", "js", "js", "php", "adb"],
    commands: ["python2.4 *", "python2.5 *", "python2.6 *", "python2.7 *", "python3.1 *",
               "python3.2 *", "python3.3 *", "python3.4 *", "python3.5 *", "python3 *",
              "gcc * -std=c90 ; ./a.out", "gcc * -std=iso9899:199409 ; ./a.out", "gcc * -std=c99 ; ./a.out",
              "gcc * -std=c11 ; ./a.out", "gcc * -std=gnu90 ; ./a.out", "gcc * -std=gnu99 ; ./a.out",
              "gcc * -std=gnu11 ; ./a.out", "g++ * -std=c++98 ; ./a.out", "g++ * -std=c++03 ; ./a.out",
              "g++ * -std=c++11 ; ./a.out", "g++ * -std=c++14 ; ./a.out", "g++ * -std=c++17 ; ./a.out",
              "g++ * -std=gnu++98 ; ./a.out", "g++ * -std=gnu++03 ; ./a.out", "g++ * -std=gnu++11 ; ./a.out", 
              "g++ * -std=gnu++14 ; ./a.out", "g++ * -std=gnu++17 ; ./a.out", "javac * ; java **", "javac * ; java **", 
              "mcs -langversion:1 * ; mono **.exe", "mcs -langversion:2 * ; mono **.exe", "mcs -langversion:3 * ; mono **.exe", 
              "mcs -langversion:4 * ; mono **.exe", "mcs -langversion:5 * ; mono **.exe","mcs -langversion:6 * ; mono **.exe", 
              "mcs -langversion:7 * ; mono **.exe", "perl *", "ruby *", "export PATH=$PATH:/usr/local/go/bin; go build; ./_", 
              "lua5.3 *", "export PATH=$PATH:/usr/local/node/bin ; node *", "export PATH=$PATH:/usr/local/node/bin ; node *", 
              "export PATH=$PATH:/usr/local/node/bin ; node *", "export PATH=$PATH:/usr/local/node/bin ; node *", 
              "export PATH=$PATH:/usr/local/node/bin ; node *", "export PATH=$PATH:/usr/local/node/bin ; node *", 
              "export PATH=$PATH:/usr/local/node/bin ; node *", "export PATH=$PATH:/usr/local/node/bin ; node *",
              "php *", "gnat make * -q ; ./**"
    ],
    images: ["python2.4-image", "python2.5-image", "python2.6-image", "python2.7-image",
             "python3.1-image", "python3.2-image", "python3.3-image", "python3.4-image", "python3.5-image",
             "python3.6-image", "c-image", "c-image", "c-image", "c-image", "c-image", "c-image", "c-image",
             "cpp-image", "cpp-image", "cpp-image", "cpp-image", "cpp-image", "cpp-image", "cpp-image",
             "cpp-image", "cpp-image", "cpp-image", "java8-image", "java10-image", "csharp-image", "csharp-image",
             "csharp-image", "csharp-image", "csharp-image", "csharp-image", "csharp-image", "perl-image", "ruby-image",
             "go-image", "lua-image", "nodejs10.5.0-image", "nodejs9.11.2-image", "nodejs7.10.1-image", "nodejs6.14.3-image",
             "nodejs5.12.0-image", "nodejs4.9.1-image", "nodejs0.12.18-image", "nodejs0.10.48-image", "php-image", "ada-image"
    ],
    timeout: 60,
    memoryLimit: 10 ** 9,
    mongoHost: "mongodb://localhost:27017/sessions",
    databaseName: "sessions",
    collectionName: "data"
}
