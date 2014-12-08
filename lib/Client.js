(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Address = require('./Address');

  var Connexion = require('./Connexion');

  var Connexion = require('./Connexion');

  var DB = require('./DB');

  function Client (address) {

    var client = this;

    process.nextTick(function () {
      client.emit('log', {
        ok: 'new Client',
        info: address
      });

      client.address = new Address(address);

      client.connexion = client.conn = new Connexion(client.address);

      client.conn.on('error', function (error) {
        client.emit('error', error);
      });

      client.conn.on('connected', function (conn) {
        client.emit('connected', conn);
      });

      client.conn.on('log', function (log) {
        client.emit('log', log);
      });
    });
  }

  util.inherits(Client, events.EventEmitter);

  Client.prototype.db = function(dbName) {
    var db = new DB(this);

    db.name = dbName;

    return db;
  };

  Client.prototype.insert = function (collection, document) {
    var query = new Query(this, 'insert', document);
    
    query.on('done', function (inserted) {
      query.emit('inserted', inserted);
    });

    return query;
  };

  Client.prettyTerminalOutput = function (o) {
    if ( 'ok' in o ) {
      console.log(' ✔ '.green + o.ok.bold.green, o.info);
    }

    else if ( 'warn' in o ) {
      console.log(' ⚠ '.yellow + o.warn.bold.yellow, o.info);
    }

    else if ( 'ko' in o ) {
      console.log(' x '.red + o.ko.bold.red, o.info);
    }

    else if ( 'message' in o ) {
      console.log(' ℹ '.cyan + o.message.bold.cyan, o.info);
    }

    console.log(' -----------------------'.grey);
  };

  module.exports = Client;
})();
