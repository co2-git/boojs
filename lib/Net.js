(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Address = require('./Address');

  var Connexion = require('./Connexion');

  var DB = require('./DB');

  function Net (address) {
    this.name = 'Net';
    this.address = new Address(address);

    var net = this;

    process.nextTick(function () {
      net.connexion = net.conn = new Connexion(net.address);

      net.conn.on('error', function (error) {
        net.emit('error', error);
      });

      net.conn.on('connected', function (conn) {
        net.emit('connected', conn);
      });
    });
  }

  util.inherits(Net, events.EventEmitter);

  Net.prototype.db = function(dbName) {
    var db = new DB(this);

    db.name = dbName;

    return db;
  };

  module.exports = Net;
})();
