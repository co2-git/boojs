(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var net = require('net');

  var Server = require('./Server');

  function Connexion (address) {

    var connexion = this;

    this.connected = false;

    function onClient (client) {
      console.log(' ✔ '.green + 'connected'.bold.green);
      console.log(' -----------------------'.grey);

      connexion.emit('connected', client);

      connexion.connected = true;

      Connexion.cache[address.toString(true)] = client;
    }

    function onData (data) {
      this.emit('log', {
        ok: 'client received response from server',
        info: data
      });
    }

    function onEnd () {

    }

    function onError (error) {
      switch ( error.code ) {
        default:
          
          connexion.emit('log', {
            ko: 'socket client error',
            info: error
          });

          return connexion.emit('error', error);

        case 'ECONNREFUSED':
          
          connexion.emit('log', {
            warn: 'socket client error',
            info: error
          });

          connexion.emit('log', {
            message: 'maybe server is not started, will try to start it now'
          });

          return new Server(address)
            .on('error', function (error) {
              error.code = 'ECONNREFUSED_TWICE';
              connexion.emit('error', error);
            })
            .on('log', function (log) {
              connexion.emit('log', log);
            })
            .on('listening', function () {

              var listeners = {
                data: connexion.client.listeners('data'),
                end: connexion.client.listeners('end'),
                error: connexion.client.listeners('error')
              };

              connexion.client = net.connect({ port: address.port }, onClient);

              connexion.client.on('error', function (error) {
                connexion.emit('error', error);
              });

              connexion.client.on('data', onData.bind(connexion));

              connexion.client.on('end', onEnd);

              listeners.data.forEach(function (listener) {
                if ( listener.name !== 'onData' ) {
                  connexion.client.on('data', listener);
                }
              });

              listeners.end.forEach(function (listener) {
                if ( listener.name !== 'onEnd' ) {
                  connexion.client.on('end', listener);
                }
              });

              listeners.error.forEach(function (listener) {
                if ( listener.name !== 'onError' ) {
                  connexion.client.on('error', listener);
                }
              });
            });
      }
    }

    process.nextTick(function () {

      connexion.emit('log', {
        ok: 'new Connexion',
        info: {
          address: address
        }
      });

      if ( Connexion.cache[address.toString(true)] ) {
        connexion.emit('connected', Connexion.cache[address.toString(true)]);
        connexion.client = Connexion.cache[address.toString(true)];
      }

      else {
        connexion.emit('log', {
          warn: 'no cache, connecting now'
        });

        connexion.client = net.connect({ port: address.port }, onClient);

        connexion.client.on('error', onError.bind(connexion));

        connexion.client.on('data', onData.bind(connexion));

        connexion.client.on('end', onEnd);
      }
    });
  }

  util.inherits(Connexion, events.EventEmitter);

  Connexion.cache = {};

  Connexion.prototype.write = function (message) {

    message = JSON.stringify(message, null, 2);

    console.log(' ℹ '.cyan + 'writing'.bold.cyan, message);
    console.log(' -----------------------'.grey);

    var connexion = this;
    
    if ( ! this.connected ) {
      console.log(' ⚠ '.yellow + 'client not connected, can not write message'.bold.yellow, message);
      console.log(' -----------------------'.grey);

      console.log(' ℹ '.cyan + 'adding a listener to write message once connected'.bold.cyan, message);
      console.log(' -----------------------'.grey);

      this.once('connected', function () {
        console.log(' ℹ '.cyan + 'writing'.bold.cyan, message);
        console.log(' -----------------------'.grey);

        connexion.client.write(message);
      });
    }
    else {
      this.client.write(message);
    }
  };

  module.exports = Connexion;
})();
