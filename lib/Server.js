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
    console.log(' ✔ '.green + 'new Server'.bold.green, address);
    console.log(' -----------------------'.grey);

    var server = this;

    this.address = address;

    this.data = {};

    process.nextTick(function () {
      server.create();
    });
  }

  util.inherits(Server, events.EventEmitter);

  Server.prototype.create = function () {
    var server = this;
    
    this.service = net.createServer(function (socket) {
      console.log(' ✔ '.green + 'server got new socket'.bold.green, socket.constructor.name);
      console.log(' -----------------------'.grey);

      socket.on('end', function () {
        console.log(' ⚠ '.yellow + 'end of service'.bold.yellow, message);
        console.log(' -----------------------'.grey);
      });

      socket.on('data', function (data) {
        console.log(' ✔ '.green + 'server got client request'.bold.green, data.toString());
        console.log(' -----------------------'.grey);

        var request;

        try {
          request = JSON.parse(data.toString());

          switch ( request.event ) {
            case 'find':
              console.log(' ℹ '.cyan + 'find'.bold.cyan, request.message);
              console.log(' -----------------------'.grey);

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
              console.log(' ℹ '.cyan + 'insert'.bold.cyan, request.message);
              console.log(' -----------------------'.grey);

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
      console.log(' ✔ '.green + 'server listening'.bold.green, server.address.port);
      console.log(' -----------------------'.grey);

      server.emit('listening');
    });

    this.service.on('error', function (error) {
      console.log(' x '.red, 'socket server error'.bold.red, error);
      console.log(' -----------------------'.grey);

      server.emit('error', error);
    });
  };

  module.exports = Server;
})();
