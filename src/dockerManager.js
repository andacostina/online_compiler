"use strict";
const constants = require("./constants.js");
var exec = require('child_process').exec;
const uuidv1 = require('uuid/v1');

function DockerManager() {
    this.languages = constants.languages;
    this.codeExamples = constants.codeExamples;
};

DockerManager.prototype.getLanguages = function() {
    return this.languages;
};

DockerManager.prototype.getCodeExamples = function() {
    return this.codeExamples;
};

DockerManager.prototype.run = function(code, language, callback) {
    const dockerImage = this.getDockerImage(language);
    this.createTempImage(function(error, stderr, stdout, tempImage, tempImageHash) {
        if (error) {
            return callback(error, stderr, stdout);
        };
        this.runContainer(tempImage, function(error, stdout, stderr) {
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

DockerManager.prototype.createTempImage = function(callback) {
    const tempImage = uuidv1();
    exec("sudo docker build -t " + tempImage + " .", function(error, stdout, stderr) {
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
        return callback(error, stderr, stdout, tempImage, tempImageHash);
    });
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