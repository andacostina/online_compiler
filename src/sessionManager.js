"use strict";

const mongodb = require("mongodb");
const constants = require("./constants.js");

class SessionManager {
    constructor(callback) {
        this.mongoHost = constants.mongoHost;
        this.databaseName = constants.databaseName;
        this.collectionName = constants.collectionName;
        this.init(callback);
    }

    init(callback) {
        var self = this;
        mongodb.MongoClient.connect(this.mongoHost, function(err, client) {
            if (err) {
                return callback(err);
            };
            self.collection = client.db(self.databaseName).collection(self.collectionName);
            return callback();
        });
    }

    get(cookie, callback) {
        this.collection.findOne({_id: cookie}, callback);
    }

    update(cookie, tree, callback) {
        this.collection.updateOne({_id: cookie}, {$set: {tree: tree}}, callback);
    }

    destroy(cookie, callback) {
        this.collection.deleteOne({_id: cookie}, callback);
    }

    create(cookie, tree, callback) {
        this.collection.insertOne({_id: cookie, tree: tree, createdOn: new Date()}, callback);
    }
}

module.exports = SessionManager;