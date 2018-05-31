"use strict";
const constants = require("./constants.js");
var exec = require('child_process').exec;
const uuidv1 = require('uuid/v1');

function DockerManager() {
    this.languages = constants.languages;
    this.codeExamples = constants.codeExamples;
    this.extensions = constants.extensions;
    this.commands = constants.commands;
    this.images = constants.images[i];
};

DockerManager.prototype.getLanguages = function() {
    return this.languages;
};

DockerManager.prototype.getCodeExamples = function() {
    return this.codeExamples;
};

DockerManager.prototype.run = function(code, language, callback) {
    const dockerImage = this.getDockerImage(language);
    this.createTempImage(code, language, function(error, stderr, stdout, uuid, tempImageHash) {
        if (error) {
            return callback(error, stderr, stdout);
        };
        this.runContainer(uuid, function(error, stdout, stderr) {
            this.deleteImage(tempImageHash);
            return callback(error, stderr, stdout);
        });
    });
};

DockerManager.prototype.getDockerImage = function(language) {
    switch(language) {
        case "C++":
            return "cpp-image"
        case "C#":
            return "csharp-image"
        default:
            return language.toLowerCase() + "-image"
    };
};

DockerManager.prototype.createTempImage = function(code, language, callback) {
    const uuid = uuidv1();
    fs.mkdirSync(uuid);
    this.createDockerfile(code, language, uuid);
    exec("sudo docker build -t " + uuid + " .", {cwd: uuid}, function(error, stdout, stderr) {
        exec("rm -r " + uuid);
        if (error) {
            console.error(error);
            return callback(error, stderr);
        };
        try {
            const tempImageHash = /Successfully built ([a-z0-9]{12})/.exec(stdout)[1];
        }
        catch(e) {
            return callback(new Error("Couldn\'t find image hash"), stderr);
        };
        return callback(error, stderr, stdout, uuid, tempImageHash);
    });
};

DockerManager.prototype.createDockerfile = function(code, language, uuid) {
    const i = this.languages.indexOf(language);
    const filename = "test." + this.extensions[i];
    const command = this.commands[i];
    const baseImage = this.images[i];
    var content = "FROM " + baseImage + "\nCOPY " + filename + " " + filename + "\nCMD [\"" + command + "\", \"" + filename + "\"]";
    fs.writeFileSync(uuid + '/Dockerfile', content);
};

DockerManager.prototype.runContainer = function(tempImage, callback) {
    exec("sudo docker run " + tempImage, callback);
};

DockerManager.prototype.deleteImage = function(imageHash) {
    this.deleteExitedContainers(function(error) {
        if (error) {
            console.error(error);
        };
        exec("sudo docker rmi " + imageHash, function(error, stderr, stdout) {
            if (error) {
                console.error(error);
            };
        });
    });
};

DockerManager.prototype.deleteExitedContainers = function(callback) {
    exec("sudo docker rm $(sudo docker ps -a -f status=exited -q)", callback);
};

module.exports = DockerManager;