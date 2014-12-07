(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Address = require('./Address');

  var Connexion = require('./Connexion');

  var DB = require('./DB');

  function Client (address) {

    console.log(' ✔ '.green + 'new Client'.bold.green, address);
    console.log(' -----------------------'.grey);

    this.address = new Address(address);

    var client = this;

    process.nextTick(function () {
      client.connexion = client.conn = new Connexion(client.address);

      client.conn.on('error', function (error) {
        client.emit('error', error);
      });

      client.conn.on('connected', function (conn) {
        client.emit('connected', conn);
      });
    });
  }

  util.inherits(Client, events.EventEmitter);

  Client.prototype.db = function(dbName) {
    var db = new DB(this);

    db.name = dbName;

    return db;
  };

  module.exports = Client;
})();
