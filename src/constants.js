'use strict';

module.exports = {
    languages: ["Python2.4", "Python2.5", "Python2.6", "Python2.7", "Python3.1", "Python3.2", 
                "Python3.3", "Python3.4", "Python3.5", "Python3.6", "C90", "C95", "C99", "C11", 
                "C17", "C-GNU90", "C-GNU99", "C-GNU11", "C++", "Java", "C#"
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
        "http://devdocs.io/c/",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf",
        "http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",
        "https://en.cppreference.com/w/cpp/header",
        "https://docs.oracle.com/javase/specs/jls/se10/html/index.html",
        "https://docs.microsoft.com/en-us/dotnet/csharp/"
    ],
    extensions: ["py", "py", "py", "py", "py", "py", "py", "py", "py", "py", "c", "c", "c", "c", "c", "c", "c", "c", "cpp", "java", "cs"],
    commands: ["python2.4 *", "python2.5 *", "python2.6 *", "python2.7 *", "python3.1 *", 
               "python3.2 *", "python3.3 *", "python3.4 *", "python3.5 *", "python3 *", 
              "gcc * -std=c90 ; ./a.out", "gcc * -std=iso9899:199409 ; ./a.out", "gcc * -std=c99 ; ./a.out", "gcc * -std=c11 ; ./a.out", 
              "gcc * -std=c17 ; ./a.out", "gcc * -std=gnu90 ; ./a.out", "gcc * -std=gnu99 ; ./a.out", 
              "gcc * -std=gnu11 ; ./a.out", "g++ * ; ./a.out", "javac * ; java **", "mcs * ; mono **.exe"],
    images: ["python2.4-image", "python2.5-image", "python2.6-image", "python2.7-image",
             "python3.1-image", "python3.2-image", "python3.3-image", "python3.4-image", "python3.5-image", 
             "python3.6-image", "c-image", "c-image", "c-image", "c-image", "c-image", "c-image", "c-image", "c-image", 
             "cpp-image", "java-image", "csharp-image"
    ],
    timeout: 60,
    memoryLimit: 10 ** 9,
    mongoHost: "mongodb://localhost:27017/sessions",
    databaseName: "sessions",
    collectionName: "data"
}
