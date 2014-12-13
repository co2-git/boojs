(function () {

  'use strict';

  var config = require('../../config.json');

  /**  Boo Server
   *
   *  @class
   *  @description The socket server
   *  @extends EventEmitter
   */

  function BooServer (address) {
    this.address = new (require('./Address'))(address);

    this.databases = {};

    this.databases[config.address.database] = {};

    this.databases[config.address.database][config.address.collection] = [];

    var self = this;

    /** Record events */

    // (function () {
    //   self.on('end', function () {
    //     self.record('end');
    //   });

    //   self.on('listening', function () {
    //     self.record('listening');
    //   });

    //   self.on('client request', function (request) {
    //     self.record('client request', request);
    //   });

    //   self.on('server response', function (response) {
    //     self.record('server response', response);
    //   });

    //   self.on('error', function (error) {
    //     self.record('error', error);
    //   });

    //   self.on('server bounced', function (port) {
    //     self.record('server bounced', port);
    //   });
    // })();
  }

  require('util').inherits(BooServer, require('events').EventEmitter);

  BooServer.prototype.record = function (event, message) {

    var record = {
      event: event,
      message: message,
      address: this.address,
      date: Date.now()
    };

    var self = this;

    process.nextTick(function () {
      self.databases[config.address.events].push(record);

      self.emit('recorded', record);
    });

    return record;
  };

  BooServer.prototype.broadcast = function (event, message) {
    this.socket.write(JSON.stringify({ event: event, message: message },
      null, 2));
  };

  /**  Create Socket Server
   *
   *  @method
   *  @description Create the Socket Server
   *  @return {BooServer}
   */

  BooServer.prototype.create = function () {
    var server = this;

    process.nextTick(function () {

      /** Create client */

      server.service = require('net').createServer(function (socket) {

        server.emit('join');

        server.socket = socket;

        server.socket.on('end', function () {
          server.emit('leave');
        });

        server.socket.on('error', function (error) {
          server.emit('error', error);
        });

        server.socket.on('data', function (data) {

          var incoming = JSON.parse(data);

          server.emit('request', incoming);
          server.broadcast('request', incoming);

          if ( 'dbs' in incoming ) {
            server.emit('dbs', Object.keys(server.databases));
            server.broadcast('dbs', Object.keys(server.databases));
          }

          else if ( 'collections' in incoming ) {
            server.emit('collections', Object.keys(server.databases[incoming.database || config.address.database]));
            server.broadcast('collections', Object.keys(server.databases[incoming.database || config.address.database]));
          }

          else if ( 'insert' in incoming ) {

            var db_name = incoming.database || config.address.database;
            var collection_name = incoming.collection || config.address.collection;

            server.emit('inserting', incoming);
            server.broadcast('inserting', incoming);

            if ( ! server.databases[db_name] ) {
              server.databases[db_name] = {};
              server.emit('new database', db_name);
              server.broadcast('new database', db_name);
            }

            if ( ! server.databases[db_name][collection_name] ) {
              server.databases[db_name][collection_name] = [];
              server.emit('new collection', collection_name);
              server.broadcast('new collection', collection_name);
            }

            incoming.count = server.databases[db_name][collection_name].push(incoming.insert);

            server.emit('inserted', incoming);
            server.broadcast('inserted', incoming);
          }

          else if ( 'find' in incoming ) {

            var db_name = incoming.database || config.address.database;
            var collection_name = incoming.collection || config.address.collection;

            server.emit('finding', incoming);
            server.broadcast('finding', incoming);

            if ( ! server.databases[db_name] ) {
              server.databases[db_name] = {};
              server.emit('new database', db_name);
              server.broadcast('new database', db_name);
            }

            if ( ! server.databases[db_name][collection_name] ) {
              server.databases[db_name][collection_name] = [];
              server.emit('new collection', collection_name);
              server.broadcast('new collection', collection_name);
            }

            server.emit('found', {
              database: db_name,
              collection: collection_name,
              documents: server.databases[db_name][collection_name]
            });
            server.broadcast('found', {
              database: db_name,
              collection: collection_name,
              documents: server.databases[db_name][collection_name]
            });
          }

          else if ( 'update' in incoming ) {

            var db_name = incoming.database || config.address.database;
            var collection_name = incoming.collection || config.address.collection;

            server.emit('updating', incoming);
            server.broadcast('updating', incoming);

            if ( ! server.databases[db_name] ) {
              server.emit('error', new Error('No such database: ' + db_name));
              server.broadcast('error', new Error('No such database: ' + db_name));
              return;
            }

            if ( ! server.databases[db_name][collection_name] ) {
              server.emit('error', new Error('No such collection: ' + collection_name));
              server.broadcast('error', new Error('No such collection: ' + collection_name));
              return;
            }

            var updated = server.databases[db_name][collection_name];

            server.databases[db_name][collection_name] = server.databases[db_name][collection_name]
              .map(function (document) {
                for ( var setter in incoming.update.$set ) {
                  document[setter] = incoming.update.$set[setter];
                }
                return document;
              });

            server.emit('updated', {
              database: db_name,
              collection: collection_name,
              documents: updated
            });
            server.broadcast('updated', {
              database: db_name,
              collection: collection_name,
              documents: updated
            });
          }

          else if ( 'remove' in incoming ) {

            var db_name = incoming.database || config.address.database;
            var collection_name = incoming.collection || config.address.collection;

            server.emit('removing', incoming);
            server.broadcast('removing', incoming);

            if ( ! server.databases[db_name] ) {
              server.emit('error', new Error('No such database: ' + db_name));
              server.broadcast('error', new Error('No such database: ' + db_name));
              return;
            }

            if ( ! server.databases[db_name][collection_name] ) {
              server.emit('error', new Error('No such collection: ' + collection_name));
              server.broadcast('error', new Error('No such collection: ' + collection_name));
              return;
            }

            var removed = server.databases[db_name][collection_name];

            server.databases[db_name][collection_name] = server.databases[db_name][collection_name]
              .filter(function (document) {
                return false;
              });

            server.emit('removed', {
              database: db_name,
              collection: collection_name,
              documents: removed
            });
            server.broadcast('removed', {
              database: db_name,
              collection: collection_name,
              documents: removed
            });
          }
        });
      });

      /** Start client */

      server.service.listen(server.address.port, server.address.server,
        function () {
          server.emit('listening', {
            port: server.address.port
          });
        });

      /** Catch client errors */

      server.service.on('error', function (error) {

        if ( error.code === 'EADDRINUSE' ) {
          server.emit('server bounced', server.address.port);
        }

        server.emit('error', error);
      });
    });

    return this;
  };

  module.exports = BooServer;

})();
