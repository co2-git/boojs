(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var net = require('net');

  var Server = require('./Server');

  function Connexion (address) {

    console.log(' ✔ '.green + 'new Connexion'.bold.green, address);
    console.log(' -----------------------'.grey);

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
      console.log(' ✔ '.green + 'client got server response'.bold.green, data.toString());
      console.log(' -----------------------'.grey);

      var message = JSON.parse(data);
    }

    function onEnd () {

    }

    function onError (error) {
      switch ( error.code ) {
        default:
          console.log(' x '.red, 'socket client error'.bold.red, error);
          console.log(' -----------------------'.grey);

          return connexion.emit('error', error);

        case 'ECONNREFUSED':
          console.log(' ⚠ '.yellow, 'socket client error'.bold.yellow, error);
          console.log(' -----------------------'.grey);

          console.log(' ℹ '.cyan + 'maybe server is not started, will try to start it now'.bold.cyan);
          console.log(' -----------------------'.grey);

          return new Server(address)
            .on('error', function (error) {
              error.code = 'ECONNREFUSED_TWICE';
              connexion.emit('error', error);
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

              connexion.client.on('data', onData);

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

    if ( Connexion.cache[address.toString(true)] ) {
      this.emit('connected', Connexion.cache[address.toString(true)]);
      this.client = Connexion.cache[address.toString(true)];
    }

    else {
      console.log(' ⚠ '.yellow + 'no cache, connecting now'.bold.yellow);
      console.log(' -----------------------'.grey);

      this.client = net.connect({ port: address.port }, onClient);

      this.client.on('error', onError);

      this.client.on('data', onData);

      this.client.on('end', onEnd);
    }
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
