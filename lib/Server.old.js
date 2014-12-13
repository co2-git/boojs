(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var net = require('net');

  function StripOperators (query) {
    var q = {};

    for ( var f in query ) {
      if ( f[0] !== '$' ) {
        q[f] = query[f];
      }
    }

    return q;
  }

  function Server (address) {

    var server = this;

    this.address = address;

    this.data = {};

    process.nextTick(function () {

      server.emit('log', {
        ok: 'new Server',
        info: address
      });

      server.create();
    });
  }

  util.inherits(Server, events.EventEmitter);

  Server.prototype.create = function () {
    var server = this;
    
    this.service = net.createServer(function (socket) {
      server.emit('log', {
        ok: 'server got new socket',
        info: socket.constructor.name
      });

      socket.on('end', function () {
        server.emit('log', {
          warn: 'end of service'
        });
      });

      socket.on('data', function (data) {
        server.emit('log', {
          ok: 'server received client request',
          info: data
        });

        var request;

        try {
          request = JSON.parse(data.toString());

          switch ( request.event ) {
            case 'find':
              server.emit('log', {
                message: 'find',
                info: request.message
              });

              if ( ! server.data[request.message.$db] ) {
                server.data[request.message.$db] = {};
              }

              var db = server.data[request.message.$db];

              if ( ! db[request.message.$collection] ) {
                db[request.message.$collection] = [];
              }

              var collection = db[request.message.$collection];

              var documents = collection;

              socket.write(JSON.stringify({
                event: 'done',
                id: request.message.$id,
                documents: documents
              }));

              break;

            case 'insert':
              server.emit('log', {
                message: 'insert',
                info: request.message
              });

              if ( ! server.data[request.message.$db] ) {
                server.data[request.message.$db] = {};
              }

              var db = server.data[request.message.$db];

              if ( ! db[request.message.$collection] ) {
                db[request.message.$collection] = [];
              }

              var collection = db[request.message.$collection];

              var index = collection.push(StripOperators(request.message));

              socket.write(JSON.stringify({
                event: 'done',
                id: request.message.$id,
                documents: collection[index]
              }));

              break;
          }
        }
        catch (error) {
          server.emit('error', error);
        }
      });
    });

    this.service.listen(this.address.port, function () {
      server.emit('log', {
        ok: 'server listening',
        info: server.address.port
      });

      server.emit('listening');
    });

    this.service.on('error', function (error) {
      server.emit('log', {
        ko: 'socket server error',
        info: error
      });

      server.emit('error', error);
    });
  };

  module.exports = Server;
})();
