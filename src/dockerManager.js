"use strict";
const constants = require("./constants.js");
var exec = require('child_process').exec;
var fs = require('fs');
const uuidv1 = require('uuid/v1');

function DockerManager() {
    this.languages = constants.languages;
    this.compiled_languages = constants.compiled_languages;
    this.inputable_languages = constants.inputable_languages;
    this.codeExamples = constants.codeExamples;
    this.extensions = constants.extensions;
    this.commands = constants.commands;
    this.images = constants.images;
    this.timeout = constants.timeout;
};

DockerManager.prototype.getLanguages = function() {
    return this.languages;
};

DockerManager.prototype.getCompiledLanguages = function() {
    return this.compiled_languages;
};

DockerManager.prototype.getInputableLanguages = function() {
    return this.inputable_languages;
};

DockerManager.prototype.getCodeExamples = function() {
    return this.codeExamples;
};

DockerManager.prototype.run = function(code, filename, language, input, callback) {
    var self = this;
    this.createTempImage(code, filename, language, input, function(error, stderr, stdout, uuid, tempImageHash) {
        if (error) {
            exec("rm -r " + uuid);
            self.deleteImage(tempImageHash);
            return callback(error, stderr, stdout);
        };
        self.runContainer(uuid, function(error, stdout, stderr) {
            exec("rm -r " + uuid);
            self.deleteImage(tempImageHash);
            return callback(error, stderr, stdout);
        });
    });
};

DockerManager.prototype.createTempImage = function(code, filename, language, input, callback) {
    const uuid = uuidv1();
    fs.mkdirSync(uuid);
    this.createDockerfile(code, filename, language, input, uuid);
    exec("sudo docker build -t " + uuid + " .", {cwd: uuid}, function(error, stdout, stderr) {
        if (error) {
            return callback(error, stderr, null, uuid);
        };
        let tempImageHash;
        try {
            tempImageHash = /Successfully built ([a-z0-9]{12})/.exec(stdout)[1];
        }
        catch(e) {
            return callback(new Error("Couldn\'t find image hash"), stderr, null, uuid);
        };
        return callback(error, stderr, stdout, uuid, tempImageHash);
    });
};

DockerManager.prototype.createDockerfile = function(code, filename, language, input, uuid) {
    const i = this.languages.indexOf(language);
    const command = this.commands[i].replace('**', filename.split('.')[0]).replace("*", filename);
    const baseImage = this.images[i];
    var content = "FROM " + baseImage + "\nCOPY " + filename + " " + filename + "\nCOPY input.txt input.txt\nCMD " + command;
    fs.writeFileSync(uuid + '/Dockerfile', content);
    fs.writeFileSync(uuid + '/' + filename, code);
    fs.writeFileSync(uuid + '/input.txt', input);
};

DockerManager.prototype.runContainer = function(tempImage, callback) {
    exec("sudo timeout --signal KILL " + this.timeout + " docker run --name " + tempImage + " " + tempImage, callback);
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

DockerManager.prototype.runAndGetBinary = function(code, filename, language, input, callback) {
    var self = this;
    this.createTempImage(code, filename, language, input, function(error, stderr, stdout, uuid, tempImageHash) {
        if (error) {
            exec("rm -r " + uuid);
            self.deleteImage(tempImageHash);
            return callback(error, stderr, stdout);
        };
        self.runContainer(uuid, function(error, stdout, stderr) {
            self.getBinary(uuid, filename, language, function(error, binary_name) {
                self.deleteImage(tempImageHash);
                return callback(error, stderr, stdout, uuid, binary_name);
            });
        });
    });

    DockerManager.prototype.getBinary = function(uuid, filename, language, callback) {
        const i = this.languages.indexOf(language);
        const command = this.commands[i].replace('**', filename.split('.')[0]).replace("*", filename);
        const splits = command.split(' ');
        var binary_name = splits[splits.length - 1];
        if (binary_name.startsWith('./')) {
            binary_name = binary_name.substring(2);
        };
	if (language.startsWith('Java')) {
            binary_name = binary_name + ".class";
        };
        exec("sudo docker cp " + uuid + ":/" + binary_name + " " + uuid + "/" + binary_name, function(error) {
            if (error) {
                return callback(error);
            };
            return callback(error, binary_name);
        });
    };
};

module.exports = DockerManager;
