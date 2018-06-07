"use strict";
const constants = require("./constants.js");
var exec = require('child_process').exec;
var fs = require('fs');
const uuidv1 = require('uuid/v1');

function DockerManager() {
    this.languages = constants.languages;
    this.codeExamples = constants.codeExamples;
    this.extensions = constants.extensions;
    this.commands = constants.commands;
    this.images = constants.images;
    this.timeout = constants.timeout;
};

DockerManager.prototype.getLanguages = function() {
    return this.languages;
};

DockerManager.prototype.getCodeExamples = function() {
    return this.codeExamples;
};

DockerManager.prototype.run = function(code, filename, language, callback) {
    var self = this;
    const dockerImage = this.getDockerImage(language);
    this.createTempImage(code, filename, language, function(error, stderr, stdout, uuid, tempImageHash) {
        if (error) {
            self.deleteImage(tempImageHash);
            return callback(error, stderr, stdout);
        };
        self.runContainer(uuid, function(error, stdout, stderr) {
            self.deleteImage(tempImageHash);
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

DockerManager.prototype.createTempImage = function(code, filename, language, callback) {
    const uuid = uuidv1();
    fs.mkdirSync(uuid);
    this.createDockerfile(code, filename, language, uuid);
    exec("sudo docker build -t " + uuid + " .", {cwd: uuid}, function(error, stdout, stderr) {
        exec("rm -r " + uuid);
        if (error) {
            console.error(error);
            return callback(error, stderr);
        };
        let tempImageHash;
        try {
            tempImageHash = /Successfully built ([a-z0-9]{12})/.exec(stdout)[1];
        }
        catch(e) {
            return callback(new Error("Couldn\'t find image hash"), stderr);
        };
        return callback(error, stderr, stdout, uuid, tempImageHash);
    });
};

DockerManager.prototype.createDockerfile = function(code, filename, language, uuid) {
    const i = this.languages.indexOf(language);
    const command = this.commands[i].replace('**', filename.split('.')[0]).replace("*", filename);
    const baseImage = this.images[i];
    var content = "FROM " + baseImage + "\nCOPY " + filename + " " + filename + "\nCMD " + command;
    fs.writeFileSync(uuid + '/Dockerfile', content);
    fs.writeFileSync(uuid + '/' + filename, code);
};

DockerManager.prototype.runContainer = function(tempImage, callback) {
    exec("sudo timeout --signal KILL " + this.timeout + " docker run " + tempImage, callback);
};

DockerManager.prototype.deleteImage = function(imageHash) {
    this.deleteExitedContainers(function(error) {
        if (error) {
            console.error(error);
        };
        exec("sudo docker rmi " + imageHash + " -f", function(error, stderr, stdout) {
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
